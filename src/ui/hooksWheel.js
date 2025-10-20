function clampIndex(value, length) {
  if (!length) return 0;
  const normalized = value % length;
  return normalized < 0 ? normalized + length : normalized;
}

export function initHookWheel(rootEl, getHooks, onChange, initialIndex = 0) {
  if (!rootEl) {
    return {
      setIndex() {},
      refresh() {},
      getIndex() {
        return 0;
      },
    };
  }

  let idx = Number.isInteger(initialIndex) ? initialIndex : 0;

  const render = () => {
    const hooks = getHooks?.() ?? [];
    if (!hooks.length) {
      rootEl.textContent = "—";
      return;
    }
    const normalized = clampIndex(idx, hooks.length);
    idx = normalized;
    rootEl.textContent = hooks[normalized]?.label || "—";
  };

  const sync = (nextIndex, notify) => {
    const hooks = getHooks?.() ?? [];
    if (!hooks.length) {
      idx = 0;
      render();
      if (notify) onChange?.(idx);
      return;
    }
    const normalized = clampIndex(nextIndex, hooks.length);
    if (normalized === idx) {
      render();
      return;
    }
    idx = normalized;
    render();
    if (notify) onChange?.(idx);
  };

  rootEl.setAttribute("tabindex", "0");
  rootEl.style.userSelect = "none";
  rootEl.style.cursor = "ns-resize";

  rootEl.addEventListener(
    "wheel",
    event => {
      event.preventDefault();
      const delta = Math.sign(event.deltaY || event.deltaX || 0) || 0;
      if (!delta) return;
      sync(idx + delta, true);
    },
    { passive: false }
  );

  rootEl.addEventListener("keydown", event => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    const delta = event.key === "ArrowDown" ? 1 : -1;
    sync(idx + delta, true);
  });

  render();
  if (Number.isInteger(initialIndex) && initialIndex !== idx) {
    sync(initialIndex, false);
  }

  return {
    setIndex(nextIndex) {
      sync(nextIndex, false);
    },
    refresh() {
      render();
    },
    getIndex() {
      return idx;
    },
  };
}

export default initHookWheel;
