import crypto from "crypto";

//verify the signature sent by github
export const verifyGithubSignature = (signature, payload, secret) => {
  if (!signature || !secret) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(
    "sha256=" + hmac.update(JSON.stringify(payload)).digest("hex"),
    "utf8"
  );

  const checksum = Buffer.from(signature, "utf8");

  return (
    checksum.length === digest.length &&
    crypto.timingSafeEqual(digest, checksum)
  );
};
