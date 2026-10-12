---
version: alpha
name: Threads Android Social Feed
description: A near-white canvas with a single black ink, a hairline-ruled feed of short text posts, a fixed 393 dp column, and one accent blue reserved for a verified badge. Covers the first batch (home feed, post detail with its reply tree, the composer states, search landing and results, activity categories, profile and its Replies tab, the Messages inbox and the login screen).
colors:
  page: "#FCFCFC"
  surface: "#FFFFFF"
  ink: "#000000"
  secondary: "#989898"
  tertiary: "#B3B3B3"
  navIdle: "#A8A8A8"
  surfaceAlt: "#F4F4F4"
  hairline: "#ECECEC"
  border: "#D4D4D4"
  field: "#F4F4F4"
  disabled: "#E8E8E8"
  chip: "#F1F1F1"
  chipInk: "#666666"
  marker: "#FAEA4E"
  markerInk: "#002A06"
  menuInk: "#999999"
  searchInk: "#A8A8A8"
  overflowInk: "#999999"
  fieldInk: "#666A72"
  hintLight: "#E0E0E0"
  pickerGrey: "#B3B3B3"
  navPlate: "#F5F5F5"
  footer: "#FAFAFA"
  verified: "#0094F4"
  unread: "#FC3040"
  igBlue: "#0868E0"
typography:
  body:
    fontFamily: Instrument Sans
    fontSize: 15
    fontWeight: 400
    lineHeight: 18.3
    letterSpacing: -0.2
  bodyMedium:
    fontFamily: Instrument Sans
    fontSize: 15
    fontWeight: 500
    lineHeight: 18.3
    letterSpacing: -0.2
  caption:
    fontFamily: Instrument Sans
    fontSize: 13
    fontWeight: 450
    lineHeight: 17
    letterSpacing: -0.2
  field:
    fontFamily: Instrument Sans
    fontSize: 16
    fontWeight: 500
    lineHeight: 20
  title:
    fontFamily: Instrument Sans
    fontSize: 17
    fontWeight: 600
    letterSpacing: -0.3
  name:
    fontFamily: Instrument Sans
    fontSize: 24
    fontWeight: 700
    lineHeight: 28
    letterSpacing: -0.4
  count:
    fontFamily: Roboto Medium
    fontSize: 13
    fontWeight: 500
spacing:
  gutter: 60
  avatarLeft: 6.2
  avatar: 48
  headerRow: 48
  actionSlot: 72
  actionLeft: 16
  navSlot: 72.4
  navLeft: 16
  frameWidth: 393
  frameHeight: 777
  navHeight: 80
rounded:
  avatar: 24
  media: 12
  pill: 18
  key: 12
  card: 16
---

## Overview

Based on Threads for Android, English, light theme, default font scale, on a 393 × 777 dp phone
frame. This document covers the first release batch only — the home feed, a post detail with its
reply tree, the composer (empty, typed and multi-segment), search landing and results, the activity
categories, the profile and its Replies tab, the Messages inbox, and the login screen. It is not a
complete system for every Threads screen.

Threads is a text-first feed, and the interface is organised around that. There is one canvas colour,
one ink, and posts separated by a hairline rather than by cards, shadows or elevation. Almost all of
the design decisions in this document exist to keep it that way: the app's character comes from
restraint and from a very tight type system, not from ornament.

## Colors

The canvas is `#FCFCFC` — deliberately not pure white — and cards sit on it as `#FFFFFF`. Text is a
single `#000000` ink, with `secondary` (`#989898`) carrying times, counts and supporting lines and
`tertiary` (`#B3B3B3`) stepping the profile's inactive section tabs one notch lighter again.
Separation is structural: a 1 px `#ECECEC` hairline closes a post, and `#D4D4D4` outlines controls
that need an edge.

Colour is rationed to three places. `verified` (`#0094F4`) is the feed's only blue and exists solely
on the verified disc. `unread` (`#FC3040`) is the inbox's unread dot. `igBlue` (`#0868E0`) belongs to
the Instagram mark on the login screen. The nearest thing to a highlight anywhere else is the search
screen's "Trending now" marker, a `#FAEA4E` plate whose own ink is `#002A06` rather than black — a
small, deliberate warmth that appears on exactly one row in the product.

Controls that need to read as "off" use `disabled` (`#E8E8E8`): the Post pill before a thread carries
text, and the composer's "Add to thread" before a segment is worth adding. Tinted plates use
`chip`/`chipInk` (`#F1F1F1` / `#666666`).

## Typography

The interface face is **Instrument Sans**, a variable font, chosen to replace the proprietary face
the original ships with because it holds the same line widths at the same sizes: across the whole
first batch, no string needed size compensation to fit, and the mean advance-width difference is
under 1.5%. Numeric strings keep **Roboto Medium**, which is the fallback the original uses for
numbers too.

Body copy is 15 dp with a 18.3 dp line and −0.2 dp tracking — the original's line is tightened, and
15 dp is wide enough that it shows. The search field and the profile's own name step rise to 16 and
24 dp; the detail header's "Thread" sits at 17 dp; the smallest captions, tab labels and view counts,
are 13 dp.

Weights are **real stops on the variable axis**, not synthesised bold, which is why the token set
carries more of them than usual:

| Token | Stop | Where |
|---|---|---|
| `regular` | 400 | Post copy, handles, times. |
| `soft` | 450 | The profile's inactive section tabs and the smallest captions. |
| `medium` | 500 | Chips, CTAs, the composer's handle — anywhere the original is visibly heavier. |
| `strong` | 550 | The profile's section label and the share plate. |
| `semibold` | 600 | The detail header. |
| `bold` | 700 | The profile name, the login wordmark. |

The 450 and 550 stops are not decoration: several labels are set lighter than a conventional medium,
and reaching for 500 there makes the row read as bolder than the design intends. Having the
intermediate stops available means the hierarchy gets expressed by weight rather than by colour.

## Layout

Everything is laid out on a **393 × 777 dp** frame that does not reflow. The structure is a 60 dp
text gutter: every post, reply and composer row starts its text at x 60, with a 48 dp avatar plate at
x 6.2 to its left. A feed row reserves 48 dp for the author line before the body copy begins, and
closes with a four-key action row in 72 dp slots from x 16.

The action keys are the one place where the layout is carried as measured boxes rather than derived
from a rule, because the boxes are not uniform — a key with a four-digit count is wider than one with
a bare label, and the row's four widths follow that. Detail pages widen the same row to the full
column and give it a taller box; replies indent by 34.2 dp per level, which is also the step the
reply tree's connector uses.

The bottom navigation occupies the last 80 dp. Its plate is `#F5F5F5`, sitting slightly proud of the
canvas, and its five keys are centred in it; the selected key is black, the rest `navIdle` (`#A8A8A8`).

## Elevation & Depth

There is almost none, and that is the point. Every screen in this batch separates content with a
hairline or a surface colour change. The single exception is the login screen, whose white card
carries the app's only shadow. Nothing else lifts: the composer is a flat sheet, the detail page is
the same canvas as the feed, and the reply tree is drawn with a 2 dp rule rather than a stack of
nested surfaces.

## Shapes

Avatars are 24 dp circles. Filled pills — Follow, Post — are 18 dp capsules at their row's full
height. The composer's media frames and the create key's rounded square use 12 dp; the link preview's
card uses 16 dp. Outlined controls, the composer's audience pill and the inbox filter, are 1 px
hairlines at half their own height, which keeps them visually lighter than the filled pills they sit
near.

## Components

**Post.** Author row — avatar, handle, optional verified disc, time — then the body run, optional
media, and a four-key action row of Like, Reply, Repost and Share, closed by a hairline. The vertical
rhythm inside a post tightens as it goes: 43.6 dp from the author row to the body, 8 dp from the body
to media and to the actions, 3.9 dp from the actions to the rule.

**Composer.** A growing text area over an audience row that carries "Add to thread" and the posting
audience. Multi-segment threads connect their segments with a 2 dp vertical rule between avatars, and
each segment can be removed on its own. "Add to thread" and the Post pill both begin `disabled` and
switch to black the moment there is text to act on.

**Reply tree.** The detail page's replies are indented and connected by the same 2 dp rule, with a
per-level indent of 34.2 dp, so a long thread reads as one conversation rather than a list.

**Profile section tabs.** Threads / Replies / Media / Reposts, each with its own weight and tracking.
The active label is black and slightly heavier; inactive labels use `tertiary`. Because the face draws
each label a little wider than the original, the active tab carries a small negative tracking rather
than stepping its weight down — tracking moves the run's extent without touching how dark it reads.

**Inbox filter.** A 48 dp square hit area whose outlined plate is inset inside it, so the control
stays reachable at its full size while the visible chip remains small. The plate carries the label
and is not itself interactive.

## Do's and Don'ts

Keep the canvas at `#FCFCFC` and separate content with hairlines; the whitespace is doing the layout
work. Reach for a heavier weight stop before reaching for a colour. Let the composer's own state drive
its controls — Post stays `disabled` until a segment has text, and switches on by itself.

Don't add brand colour to chrome: the blue is a verified badge and the red is an unread dot, and
neither is an accent to be reused. Don't widen the frame — it is a phone app at 393 dp and a wider
layout is a different product. Don't synthesise bold; the face is variable, so use the axis. And don't
ship screenshots as UI: every screen here is real components and real local state, with icons drawn as
inline SVG.

## Responsive Behavior

None, intentionally. The interface is designed for a phone-width column and stays a centred 393 dp
column on wider screens rather than stretching, because every box in this document is stated in that
frame's coordinates.

## Iteration Guide

Change a value in `src/tokens.ts` first and rebuild; tokens are shared across screens, so one change
moves several. Longer notes on a screen's own geometry live in that component's file header — the
measured tables an edit would otherwise have to rediscover.

## Known Gaps

- Only the first batch is built. Dark theme, the image viewer, repost and quote sheets, the full
  audience selector, follow-state sync, edit-profile and settings are not in this edition.
- Icons are original drawings that approximate the originals' geometry rather than the originals.
- The feed is a fixed local set of posts, accounts and artwork; search, filtering and real account
  data are not modelled, and the composer's Post does not persist anything.
- Checked in one browser at 393 dp; that is not a statement about other browsers or about native
  acceptance.

---

<!-- Everything below is internal development provenance. It is not part of the outcome document and
     is not what ships: `spec/export-manifest.json` declares DESIGN.md under `preserve`, so the
     publication checkout is authored separately from this file. Keep new provenance here rather than
     in the sections above, which are written for a reader of the design system. -->

## Provenance (internal)

Where each group of values above comes from, so a later edit can re-derive rather than re-guess.

**The frame.** `x_logical = x_raw / 2.75`, `y_logical = (y_raw - 136) / 2.75` against the reference
build's 1080 × 2340 raster at 440 dpi, whose own status bar is the 136 px that is subtracted. 2.75 is
1080 / 393. `src/tokens.ts` states the same mapping at the top of the file.

**Colours.** Median of the 1% of pixels furthest from each box's dominant colour, read off the
reference rasters — the same rule the acceptance gate's `colour()` uses, which is why the canvas is
`#FCFCFC` and not `#FFFFFF`. The per-token sample coordinates are in the comments of
`src/tokens.ts`, one line each, with the capture named.

**Type sizes.** A single-line run reports its rendered width in the reference dump; dividing by the
original face's own advance width for that string (normalised to em) gives the size. The clusters
that come back are 15 / 16 / 17 / 24 dp, which is where `type` comes from. The original face is
proprietary, so the substitute was chosen by per-string advance width over a 140-string corpus taken
from the T1–T10 dumps — mean deviation 1.48%, best size multiplier 0.9976, i.e. none needed. Ranking
and full candidate table: `spec/font-metrics.json`.

**Weights.** The substitute face is declared `font-weight: 100 900` in `src/webfont.ts`, so the stops
are real axis positions. Where a row's ink did not match at the declared stop, the axis was swept in
situ (400 → 700 in 50 steps, plus 200–350 to confirm the axis is clamped at 400) and the stop was
chosen from the measured curve. Rows whose whole available range stays outside the band are
registered, with their curves, in `spec/gate.json#ink_amount_deviations`; each carries the reason it
cannot be closed. The curve sweep lives in `.runtime/_scratch/weight_curve_insitu.py`.

**Boxes carried as measured values.** The action-key boxes, the feed card headers, the bottom bar's
plate and the profile tabs are per-screen measured tables rather than derived rules, because the
reference's own widget internals decided them — the four action-key widths follow the digit count of
its sample content. Each table names its capture in the component's file header (`ThreadDetail.tsx`
and `tokens.ts` for the action rows, `Chrome.tsx` for the bar, `ProfileScreen.tsx` for the tabs).

**Deviations knowingly carried.** Custom icon glyphs, a substitute typeface and the rows registered in
`spec/gate.json#ink_amount_deviations`. Two reference boxes that the acceptance gate cannot compare
are recorded separately in `spec/gate.json#ref_box_anomalies` — a box 8.4 dp tall that crops its own
glyphs, and a container box that is effectively unpainted.
