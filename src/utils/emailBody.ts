import config from 'config'

export const emailBody = (user: any) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG />
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="x-apple-disable-message-reformatting" />
<!--[if !mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<title></title>
<style type="text/css">@media only screen and (min-width:520px){.u-row{width:500px!important}.u-row .u-col{vertical-align:top}.u-row .u-col-100{width:500px!important}}@media(max-width:520px){.u-row-container{max-width:100%!important;padding-left:0!important;padding-right:0!important}.u-row .u-col{min-width:320px!important;max-width:100%!important;display:block!important}.u-row{width:100%!important}.u-col{width:100%!important}.u-col>div{margin:0 auto}}body{margin:0;padding:0}table,tr,td{vertical-align:top;border-collapse:collapse}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors='true']{color:inherit!important;text-decoration:none!important}table,td{color:#000}#u_body a{color:#00e;text-decoration:underline}@media(max-width:480px){#u_content_button_1 .v-size-width{width:100%!important}}</style>
</head>
<body class="clean-body u_body" style="margin:0;padding:0;-webkit-text-size-adjust:100%;background-color:#e7e7e7;color:#000">
<!--[if IE]><div class="ie-container"><![endif]-->
<!--[if mso]><div class="mso-container"><![endif]-->
<table id="u_body" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;min-width:320px;margin:0 auto;background-color:#e7e7e7;width:100%" cellpadding="0" cellspacing="0">
<tbody>
<tr style="vertical-align:top">
<td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#e7e7e7"><![endif]-->
<div class="u-row-container" style="padding:0;background-color:transparent">
<div class="u-row" style="margin:0 auto;min-width:320px;max-width:500px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:transparent">
<div style="border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0;background-color:transparent" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:#fff;width:500px;padding:10px 0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width:320px;min-width:500px;display:table-cell;vertical-align:top">
<div style="background-color:#fff;height:100%;width:100%!important">
<!--[if (!mso)&(!IE)]><!--><div style="box-sizing:border-box;height:100%;padding:10px 0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"><!--<![endif]-->
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<h1 style="margin:0;line-height:140%;text-align:left;word-wrap:break-word;font-size:22px;font-weight:400">
👋<strong> Welcome to DAM</strong>
</h1>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<div style="font-size:14px;line-height:140%;text-align:left;word-wrap:break-word">
<div>Dear ${user.name},</div>
<p> </p>
<div>
<div>
Thanks you for signing up on DAM. We are
thrilled to have you on board, and we look
forward to building a valuable and
long-lasting relationship with you.
</div>
<p> </p>
<div>
<div>
We appreciate your interest and support
in staying connected with our updates,
latest news, and valuable content.
</div>
</div>
</div>
</div>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<h1 style="margin:0;line-height:140%;text-align:left;word-wrap:break-word;font-size:22px;font-weight:400">
👦 <strong>Profile</strong>
</h1>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<div style="font-size:14px;line-height:140%;text-align:left;word-wrap:break-word">
<div>
Visit and edit your profile. Start writing
articles for your favourite show, movie,
anime, manga, game or comics and start
engaging with the community.
</div>
</div>
</td>
</tr>
</tbody>
</table>
<table id="u_content_button_1" style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<!--[if mso ]><style>.v-button{background:transparent!important}</style><! [endif]-->
<div align="center">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:37px;v-text-anchor:middle;width:168px" arcsize="11%" stroke="f" fillcolor="#000000"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif"><![endif]-->
<a
href=${config.get('clientUrl')}/@${user.username}
target="_blank"
class="v-button v-size-width"
style="
                                      box-sizing: border-box;
                                      display: inline-block;
                                      font-family: arial, helvetica, sans-serif;
                                      text-decoration: none;
                                      -webkit-text-size-adjust: none;
                                      text-align: center;
                                      color: #ffffff;
                                      background-color: #000000;
                                      border-radius: 4px;
                                      -webkit-border-radius: 4px;
                                      -moz-border-radius: 4px;
                                      width: 35%;
                                      max-width: 100%;
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      word-wrap: break-word;
                                      mso-border-alt: none;
                                      font-size: 14px;
                                    "
>
<span style="display:block;padding:10px 20px;line-height:120%"><span style="line-height:16.8px">Visit your profile</span></span>
</a>
<!--[if mso]></center></v:roundrect><![endif]-->
</div>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<h1 style="margin:0;line-height:140%;text-align:left;word-wrap:break-word;font-size:22px;font-weight:400">
💌 <strong>Newsletter</strong>
</h1>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<div style="font-size:14px;line-height:140%;text-align:left;word-wrap:break-word">
<div>
By signing up on DAM you are automatically
signed up for the newsletter. You will get
all updates and handpicked articles every
weekend in your email inbox.
</div>
</div>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<h1 style="margin:0;line-height:140%;text-align:left;word-wrap:break-word;font-size:22px;font-weight:400">
🤝<strong>Social</strong>
</h1>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<div style="font-size:14px;line-height:140%;text-align:left;word-wrap:break-word">
<div>
Follow DAM on social media to stay updated
and connected.
</div>
</div>
</td>
</tr>
</tbody>
</table>
<table style="font-family:arial,helvetica,sans-serif" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
<tbody>
<tr>
<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif" align="left">
<div align="center">
<div style="display:table;max-width:147px">
<!--[if (mso)|(IE)]><table width="147" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;width:147px"><tr><![endif]-->
<!--[if (mso)|(IE)]><td width="32" style="width:32px;padding-right:5px" valign="top"><![endif]-->
<table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width:32px!important;height:32px!important;display:inline-block;border-collapse:collapse;table-layout:fixed;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;margin-right:5px">
<tbody>
<tr style="vertical-align:top">
<td align="left" valign="middle" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
<a href="https://facebook.com/" title="Facebook" target="_blank">
<img src="https://onedrive.live.com/embed?resid=7D49A24039CB111A%21334&authkey=%21ADaxg3zzoewNPXM&width=144&height=144" alt="Facebook" title="Facebook" width="32" style="outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;clear:both;display:block!important;border:0;height:auto;float:none;max-width:32px!important" />
</a>
</td>
</tr>
</tbody>
</table>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td width="32" style="width:32px;padding-right:5px" valign="top"><![endif]-->
<table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width:32px!important;height:32px!important;display:inline-block;border-collapse:collapse;table-layout:fixed;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;margin-right:5px">
<tbody>
<tr style="vertical-align:top">
<td align="left" valign="middle" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
<a href="https://twitter.com/" title="Twitter" target="_blank">
<img src="https://onedrive.live.com/embed?resid=7D49A24039CB111A%21335&authkey=%21AOv0LgAUmaLThhE&width=144&height=144" alt="Twitter" title="Twitter" width="32" style="outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;clear:both;display:block!important;border:0;height:auto;float:none;max-width:32px!important" />
</a>
</td>
</tr>
</tbody>
</table>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td width="32" style="width:32px;padding-right:5px" valign="top"><![endif]-->
<table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width:32px!important;height:32px!important;display:inline-block;border-collapse:collapse;table-layout:fixed;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;margin-right:5px">
<tbody>
<tr style="vertical-align:top">
<td align="left" valign="middle" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
<a href="https://instagram.com/" title="Instagram" target="_blank">
<img src="https://onedrive.live.com/embed?resid=7D49A24039CB111A%21333&authkey=%21AED5U7VqKhd9CP4&width=144&height=144" alt="Instagram" title="Instagram" width="32" style="outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;clear:both;display:block!important;border:0;height:auto;float:none;max-width:32px!important" />
</a>
</td>
</tr>
</tbody>
</table>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td width="32" style="width:32px;padding-right:0" valign="top"><![endif]-->
<table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width:32px!important;height:32px!important;display:inline-block;border-collapse:collapse;table-layout:fixed;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;margin-right:0">
<tbody>
<tr style="vertical-align:top">
<td align="left" valign="middle" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
<a href="https://pinterest.com/" title="Pinterest" target="_blank">
<img src="https://onedrive.live.com/embed?resid=7D49A24039CB111A%21336&authkey=%21AFr2T1p8V7XHoWc&width=144&height=144" alt="Pinterest" title="Pinterest" width="32" style="outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;clear:both;display:block!important;border:0;height:auto;float:none;max-width:32px!important" />
</a>
</td>
</tr>
</tbody>
</table>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
</div>
</div>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if mso]></div><![endif]-->
<!--[if IE]></div><![endif]-->
</body>
</html>`
}
