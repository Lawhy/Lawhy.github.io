// Simple tab control: clicking a [role="tab"] activates it and reveals
// the panel referenced by aria-controls; siblings are hidden.

(function () {
  const tablists = document.querySelectorAll('[role="tablist"]');
  if (!tablists.length) return;

  tablists.forEach((list) => {
    const tabs = list.querySelectorAll('[role="tab"]');
    if (!tabs.length) return;

    const panelFor = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

    const activate = (tab) => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
        const panel = panelFor(t);
        if (panel) panel.hidden = !active;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        activate(tab);
      });
      tab.addEventListener('keydown', (e) => {
        const i = [...tabs].indexOf(tab);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = tabs[(i + 1) % tabs.length];
          next.focus();
          activate(next);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = tabs[(i - 1 + tabs.length) % tabs.length];
          prev.focus();
          activate(prev);
        }
      });
    });
  });

  // Allow any element to trigger a tab via data-activate-tab="<tab-id>".
  // Used by in-page links like "Selected works → #blog (文学 tab)".
  const activateById = (tabId) => {
    const targetTab = document.getElementById(tabId);
    if (!targetTab) return false;
    const tablist = targetTab.closest('[role="tablist"]');
    if (!tablist) return false;
    const siblings = tablist.querySelectorAll('[role="tab"]');
    siblings.forEach((t) => {
      const isActive = t === targetTab;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.tabIndex = isActive ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !isActive;
    });
    return true;
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-activate-tab]');
    if (!trigger) return;
    activateById(trigger.dataset.activateTab);
  });
})();
