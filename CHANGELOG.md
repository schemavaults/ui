# Changelog

## 0.19.0

### Changed

- **Stepper**: `StepperBody` no longer pins itself to a fixed `40vh` height.
  The outer container now uses `flex-1 min-h-0` so the body fills the
  available vertical space of its parent flex column, and the inner
  framer-motion scroll container uses `flex: 1` + `minHeight: 0` with
  `overflow-y: auto` (scrollbar only appears on true overflow).

### Behavior change / caller contract

- `<Stepper>` must be rendered inside a parent that establishes a bounded
  vertical flex column — e.g. `<div className="h-full flex flex-col">` or a
  `grow flex flex-col` subtree inside a flex-column ancestor with a defined
  height. Without that, `flex-1` has nothing to grow into.
- A `min-h-[40vh]` safety floor is kept on `StepperBody`'s outer container
  so the legacy fixed-height behavior is preserved when a consumer hasn't
  wired up the column chain. Consumers that previously relied on the fixed
  `40vh` height may see visual differences when the stepper now grows to
  fill a bounded column.
