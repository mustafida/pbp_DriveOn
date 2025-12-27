import crypto from "crypto";
import axios from "axios";

export class TripayService {
  static _clean(value) {
    // buang spasi, buang koma yang sering ikut kepaste
    return String(value || "")
      .trim()
      .replace(/,+$/g, "") // hapus koma di akhir
      .replace(/\s+/g, " "); // rapihin spasi berlebih
  }

  static _baseUrl() {
    return this._clean(process.env.TRIPAY_BASE_URL) || "https://tripay.co.id/api-sandbox";
  }

  static _apiKey() {
    return this._clean(process.env.TRIPAY_API_KEY);
  }

  static _privateKey() {
    return this._clean(process.env.TRIPAY_PRIVATE_KEY);
  }

  static _merchantCode() {
    return this._clean(process.env.TRIPAY_MERCHANT_CODE);
  }

  static _authHeaders() {
    const apiKey = this._apiKey();
    if (!apiKey) throw new Error("TRIPAY_API_KEY belum diisi di .env");

    return {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * signature untuk create transaction:
   * HMAC_SHA256(privateKey, merchantCode + merchantRef + amount)
   */
  static _createSignature(merchantRef, amount) {
    const privateKey = this._privateKey();
    const merchantCode = this._merchantCode();

    if (!privateKey) throw new Error("TRIPAY_PRIVATE_KEY belum diisi di .env");
    if (!merchantCode) throw new Error("TRIPAY_MERCHANT_CODE belum diisi di .env");

    const payload = `${merchantCode}${merchantRef}${amount}`;
    return crypto.createHmac("sha256", privateKey).update(payload).digest("hex");
  }

  static async getPaymentChannels() {
    const url = `${this._baseUrl()}/merchant/payment-channel`;

    try {
      const res = await axios.get(url, { headers: this._authHeaders() });
      const json = res.data;

      if (json?.success === false) {
        throw new Error(`Tripay channels error: ${json?.message || "unknown"}`);
      }
      return json.data || [];
    } catch (err) {
      // bikin error lebih kebaca
      const status = err?.response?.status;
      const data = err?.response?.data;
      throw new Error(
        `Tripay get channels failed${status ? ` (HTTP ${status})` : ""}: ${
          data?.message ? data.message : err.message
        }`
      );
    }
  }

  static async createTransaction({
    method,
    merchantRef,
    amount,
    customerName,
    customerEmail,
    orderItems,
    callbackUrl,
    returnUrl,
    expiredSeconds,
  }) {
    const url = `${this._baseUrl()}/transaction/create`;
    const signature = this._createSignature(merchantRef, amount);

    const payload = {
      method,
      merchant_ref: merchantRef,
      amount: Number(amount),
      customer_name: customerName,
      customer_email: customerEmail,
      order_items: orderItems,
      callback_url: callbackUrl,
      return_url: returnUrl,
      expired_time: Math.floor(Date.now() / 1000) + Number(expiredSeconds || 7200),
      signature,
    };

    try {
      const res = await axios.post(url, payload, { headers: this._authHeaders() });
      const json = res.data;

      if (json?.success === false) {
        throw new Error(`Tripay create error: ${json?.message || "unknown"}`);
      }

      const data = json.data || {};
      if (!data.reference || !data.checkout_url) {
        throw new Error(`Tripay response tidak lengkap`);
      }

      return {
        reference: data.reference,
        checkout_url: data.checkout_url,
      };
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      throw new Error(
        `Tripay create transaction failed${status ? ` (HTTP ${status})` : ""}: ${
          data?.message ? data.message : err.message
        }`
      );
    }
  }

  /**
   * Verify callback signature:
   * compare header X-Callback-Signature dengan HMAC_SHA256(privateKey, rawBody)
   */
  static verifyCallbackSignature({ rawBody, callbackSignature }) {
    const privateKey = this._privateKey();
    if (!privateKey) return false;

    const expected = crypto
      .createHmac("sha256", privateKey)
      .update(String(rawBody || ""))
      .digest("hex");

    return expected === String(callbackSignature || "");
  }
}
