# Editable banking demo

## One-file version
Open banking-demo-editable.html in a browser. All screen labels, sample defaults, CSS and JavaScript are inside that HTML. Logo and card images are embedded. The reference font loads online; system fonts are used if offline.

To edit text, search for it in the HTML with your editor. Screen functions contain labels; the initial object contains profile defaults. Existing saved browser edits override defaults, so clear this demo’s browser storage when testing new default data. Keep the visible Demo identification.

## Controls
Passcode: 3012. Triple-tap the card to edit fictional profile details, masked card number, each account number, BSB and available sample balance. Triple-tap any transaction amount to edit it.

Both accounts show five transactions initially. Scroll near the bottom or select Load 5 more transactions for the next five. The demo includes 50 sample records per account, using randomly selected Sydney locations. Changing tabs or accounts resets the visible batch to five.

## Hosted version
index.html, app.js, style.css, manifest.webmanifest and assets/ are the deployable version, including home-screen icon metadata. The standalone HTML is intended for editing and preview; use the hosted page to install a home-screen shortcut.

## Verification and limits
Checked layout widths 320, 375, 390, 428 and 440 pixels without horizontal document overflow. Verified both accounts’ five-row loading and account-number/BSB propagation. This is a close visual prototype, not a guaranteed 1:1 replica. Passcode is a client-side simulation, not secure authentication. No real banking activity occurs.
