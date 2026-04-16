function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const getPasswordResetTemplate = ({ customerName, resetUrl, expiryMinutes = 60 }) => {
  const name = escapeHtml(customerName || 'Cliente')
  const url  = escapeHtml(resetUrl)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation du mot de passe</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="580" cellspacing="0" cellpadding="0" style="background:#ffffff;max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1C1917;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.1em;color:#ffffff;font-family:Georgia,serif;">
                ÉLITE
              </p>
              <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#A16207;">
                Maison de Beauté
              </p>
            </td>
          </tr>

          <!-- Gold bar -->
          <tr><td style="height:3px;background:#A16207;"></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:#A16207;">
                Sécurité du compte
              </p>
              <h1 style="margin:0 0 24px;font-size:26px;font-weight:700;color:#1C1917;font-family:Georgia,serif;line-height:1.2;">
                Réinitialisation<br>du mot de passe
              </h1>

              <p style="margin:0 0 16px;font-size:15px;color:#57534E;line-height:1.7;">
                Bonjour <strong style="color:#1C1917;">${name}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#57534E;line-height:1.75;">
                Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte Elite.
                Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
              </p>

              <!-- CTA -->
              <table cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#1C1917;">
                    <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <p style="margin:0 0 24px;font-size:12px;color:#A8A29E;line-height:1.6;">
                Ce lien est valable pendant <strong>${expiryMinutes}&nbsp;minutes</strong>.
                Après expiration, vous devrez effectuer une nouvelle demande.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #F0EDE8;margin:24px 0;">

              <p style="margin:0 0 8px;font-size:12px;color:#A8A29E;line-height:1.6;">
                Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet e-mail.
                Votre mot de passe actuel reste inchangé.
              </p>
              <p style="margin:0;font-size:11px;color:#D6D3D1;">
                Pour des raisons de sécurité, ne partagez jamais ce lien.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#FAFAF9;border-top:1px solid #F0EDE8;padding:20px 40px;">
              <p style="margin:0;font-size:11px;color:#A8A29E;line-height:1.6;">
                © Elite — Maison de Beauté de Luxe, Tunisie.<br>
                Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
