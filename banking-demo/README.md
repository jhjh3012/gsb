# Southern Banking Demo — source code

This is an independent, visibly labelled banking prototype using sample data. It is not an exact replica or connected to a bank.

## Open it

Extract the ZIP and open index.html in a browser. For consistent browser storage, serve this folder with a local web server. No build step or dependencies are required. The font loads from Google Fonts when online.

## Use it

- Demo passcode: 3012 (a client-side simulation, not security).
- Triple-tap the card to edit the sample name, age, masked card number and opening balances.
- Card numbers use six digits, six X characters, then four digits, e.g. 123456XXXXXX7890.
- Triple-tap a transaction amount in the list or details screen to edit it.
- Default sample transaction dates follow the current date; manually changed dates stay fixed.
- Changes save in this browser.

## Files

- index.html — page structure and compact Demo label.
- style.css — layout, colours, typography, spacing and responsive sizing. The refinements are at the end under “Refined mobile proportions”.
- app.js — screens, sample data, passcode flow, edits and date handling.
- assets/card-hd.png — higher-resolution card artwork cropped from the supplied recording.

## Proportions

The working viewport is 428 CSS pixels wide, based on the 1284-pixel recording at 3× density. The website does not reproduce iOS status bars or browser chrome. Screen spacing and font metrics remain approximate; this version is not pixel-perfect.

## Validation

JavaScript syntax checked. The updated passcode flow was checked in the preview. Further mobile visual QA is needed before calling the layout final.
