# Virtual Dog Park

A small dog encyclopedia and virtual pet website built for the AIE1101 Week 8
Lab 2 (Vibe Coding) assignment. The project uses plain HTML, CSS and JavaScript:
there is no framework, no build step, no backend and no package manager.

## Features

- **Dog encyclopedia** — Beagle, Golden Retriever and Poodle, each with its own
  SVG illustration and short notes on size, personality and everyday care.
- **Adoption** — choose a breed, type a name of up to 20 characters, and adopt
  one dog. Spaces at the two ends of the name are removed, a blank name is
  rejected with a message, and the name is displayed as plain text.
- **Feed and Play** — each button adds 10 happiness, up to a maximum of 100.
- **Next Day** — moves the dog one day forward and lowers happiness by 5,
  never below 0. It simulates time, so no real day has to pass.
- **Growth** — the stage is shown three ways: in words, as a growth bar, and
  with a different bar shade for each stage.
- **Saved progress** — the adopted dog is stored in the browser's
  `localStorage` and restored after the page is refreshed.
- **Start Over** — asks for confirmation, then deletes the saved dog and
  returns to the adoption form. Cancelling keeps the dog.
- **Responsive layout** — the breed cards stack in one column on a narrow
  screen, with no sideways scrolling.

## Files

```
virtual-dog-park/
├── .gitignore
├── README.md
├── index.html      page structure
├── style.css       layout and colours
├── script.js       adoption, care, growth and storage
└── assets/
    ├── beagle.svg
    ├── golden-retriever.svg
    └── poodle.svg
```

## How to preview the page

1. Open the project folder in VS Code.
2. In Extensions, install **Live Server** by Ritwick Dey.
3. Right-click `index.html` in the Explorer and choose **Open with Live Server**.
4. The page opens at a local address such as `http://127.0.0.1:5500`.

Use a local server rather than double-clicking the file. Browser storage can
behave differently on a `file://` address, so saved progress may look broken.

## Growth and happiness rules

| Action | Effect |
| --- | --- |
| Adopt | A new dog starts on Day 1, at the Puppy stage, with happiness 50 |
| Feed | +10 happiness, never above 100 |
| Play | +10 happiness, never above 100 |
| Next Day | Day +1 and happiness -5, never below 0 |

| Day | Stage |
| --- | --- |
| 1 | Puppy |
| 2 and 3 | Young Dog |
| 4 and later | Adult Dog |

The same `stageFor(day)` function answers for every part of the page, so the
written stage and the growth bar can never disagree.

## Where the pet's progress is stored

The dog's name, breed, day and happiness are saved in the browser's
`localStorage` under the key `virtualDogParkPetV1`. This is a storage area
inside the visitor's own browser, not an online account.

- The saved dog appears only in the **same browser on the same device**, at the
  same local address.
- The data is **not uploaded to GitHub** and is not part of this repository.
- A different browser, a different device or a different address starts with an
  empty park.
- The data is deleted when the visitor selects **Start Over** and confirms, or
  when the browser's site data is cleared.

The save happens immediately after adoption and after every Feed, Play and
Next Day action, so a refresh always shows the latest values.

## Manual testing checklist

The routine below was followed by hand in the browser during the lab. The
project is trusted only where the browser itself showed the expected result.

- [ ] Three breed entries and three illustrations appear, with no broken image.
- [ ] Adopting with an empty name is rejected and a message appears.
- [ ] A name such as `  Buddy  ` is adopted as `Buddy`.
- [ ] A name containing `<` and `>` is shown as text, not as HTML.
- [ ] Typing more than 20 characters stops at 20.
- [ ] Adopting shows Day 1, Puppy and happiness 50.
- [ ] Feed and Play raise happiness 50 → 60 → 70 and stop at 100.
- [ ] Happiness never goes above 100 or below 0.
- [ ] Next Day gives Day 2 / Young Dog, Day 3 / Young Dog, Day 4 / Adult Dog.
- [ ] Each Next Day lowers happiness by 5.
- [ ] The growth bar looks clearly different at Puppy, Young Dog and Adult Dog.
- [ ] Refreshing after adoption restores the dog.
- [ ] Refreshing after Play, Feed and Next Day restores the latest values.
- [ ] Start Over → Cancel keeps the dog.
- [ ] Start Over → Confirm returns to the form, and the old dog does not return
      after another refresh.
- [ ] On a narrow window the text stays readable, the cards stack, and there is
      no horizontal scrolling.

## Illustrations

The three dog illustrations in `assets/` are simple SVG drawings created for
this project. They are original illustrations, not photographs of real dogs,
and they are not linked from any external website.
