import { createSearch, type SearchEntry } from "../lib/search";

let searchPromise: Promise<ReturnType<typeof createSearch>> | undefined;
function loadSearch() {
  if (!searchPromise)
    searchPromise = fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json() as Promise<SearchEntry[]>;
      })
      .then(createSearch)
      .catch((error) => {
        searchPromise = undefined;
        throw error;
      });
  return searchPromise;
}

function highlight(element: HTMLElement, text: string, query: string) {
  const terms = query.match(/[\p{L}\p{N}]+/gu) ?? [];
  if (!terms.length) {
    element.textContent = text;
    return;
  }
  const pattern = new RegExp(`(${terms.join("|")})`, "giu");
  text.split(pattern).forEach((part, i) => {
    const node =
      i % 2 ? document.createElement("mark") : document.createTextNode(part);
    node.textContent = part;
    element.append(node);
  });
}
function snippet(entry: SearchEntry, query: string) {
  const terms = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const body = entry.text.replace(/\s+/g, " ");
  const positions = terms
    .map((term) => body.toLowerCase().indexOf(term))
    .filter((pos) => pos >= 0);
  if (!positions.length) return entry.summary;
  const start = Math.max(0, Math.min(...positions) - 65);
  return `${start ? "…" : ""}${body.slice(start, start + 200)}${start + 200 < body.length ? "…" : ""}`;
}
function renderResults(
  list: HTMLUListElement,
  entries: SearchEntry[],
  query: string,
  full: boolean,
) {
  list.replaceChildren();
  for (const entry of entries) {
    const li = document.createElement("li");
    if (full) {
      const context = document.createElement("p");
      context.className = "result-context";
      context.textContent = `India / ${entry.hub}`;
      li.append(context);
    }
    const a = document.createElement("a");
    a.href = entry.route;
    const title = document.createElement(full ? "span" : "strong");
    highlight(title, entry.title, query);
    a.append(title);
    const p = document.createElement("p");
    highlight(p, snippet(entry, query), query);
    if (full) li.append(a, p);
    else {
      a.append(p);
      li.append(a);
    }
    list.append(li);
  }
}

export function setupSearch() {
  const dialog = document.querySelector<HTMLDialogElement>("#search-dialog")!;
  const input = document.querySelector<HTMLInputElement>("#command-query")!;
  const list = document.querySelector<HTMLUListElement>("#command-results")!;
  const status = document.querySelector<HTMLElement>("#command-status")!;
  const allResults = document.querySelector<HTMLAnchorElement>("#all-results")!;
  let returnFocus: HTMLElement | null = null;
  let revision = 0;
  async function update() {
    const version = ++revision,
      query = input.value.trim();
    allResults.href = `/search${query ? `?q=${encodeURIComponent(query)}` : ""}`;
    if (!query) {
      list.replaceChildren();
      status.textContent = "Try “MP”, “RTI” or “budget”.";
      return;
    }
    list.replaceChildren();
    status.textContent = "Searching…";
    try {
      const search = await loadSearch();
      if (version !== revision) return;
      const results = search(query);
      renderResults(list, results.slice(0, 8), query, false);
      status.textContent = results.length
        ? `${results.length} ${results.length === 1 ? "article" : "articles"} found`
        : "No articles found. Try a simpler term.";
    } catch {
      if (version === revision)
        status.textContent =
          "Search could not load. Check your connection and try again.";
    }
  }
  function open() {
    if (dialog.open) return;
    returnFocus = document.activeElement as HTMLElement;
    dialog.showModal();
    input.focus();
    void update();
  }
  document
    .querySelectorAll<HTMLAnchorElement>("[data-open-search]")
    .forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        open();
      });
      if (!/Mac|iPhone|iPad/.test(navigator.platform))
        trigger.querySelector("kbd")!.textContent = "Ctrl K";
    });
  document.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement;
    const editing =
      target.matches("input, textarea, select") || target.isContentEditable;
    if (
      ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") ||
      (event.key === "/" &&
        !editing &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey)
    ) {
      event.preventDefault();
      dialog.open ? dialog.close() : open();
    }
  });
  input.addEventListener("input", () => void update());
  document
    .querySelector("#close-search")!
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    ++revision;
    returnFocus?.focus();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("keydown", (event) => {
    const links = [...list.querySelectorAll<HTMLAnchorElement>("a")];
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
      return;
    }
    if (event.key === "Tab") {
      const controls = [
        ...dialog.querySelectorAll<HTMLElement>("input, button, a[href]"),
      ];
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    const selected = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next =
        selected < 0
          ? event.key === "ArrowDown"
            ? 0
            : links.length - 1
          : (selected + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
            links.length;
      if (links.length) links[next].focus();
    } else if (event.key === "Enter" && event.target === input && links[0]) {
      event.preventDefault();
      links[0].click();
    }
  });

  const form = document.querySelector<HTMLFormElement>("#search-form");
  if (!form) return;
  const pageInput = document.querySelector<HTMLInputElement>("#search-query")!;
  const pageList = document.querySelector<HTMLUListElement>("#search-results")!;
  const pageStatus = document.querySelector<HTMLElement>("#search-status")!;
  let pageRevision = 0;
  async function updatePage() {
    const version = ++pageRevision,
      query = pageInput.value.trim();
    const url = new URL(location.href);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    history.replaceState(null, "", url);
    if (!query) {
      pageList.replaceChildren();
      pageStatus.textContent =
        "Search all 40 published guides. Try “MP”, “RTI”, “WhatsApp”, “budget” or “unemployment”.";
      return;
    }
    pageList.replaceChildren();
    pageStatus.textContent = "Searching…";
    try {
      const search = await loadSearch();
      if (version !== pageRevision) return;
      const results = search(query);
      renderResults(pageList, results, query, true);
      pageStatus.textContent = results.length
        ? `${results.length} ${results.length === 1 ? "article" : "articles"} found for “${query}”`
        : "No published article matches that search. Try an institution, issue or simpler term.";
    } catch {
      if (version === pageRevision)
        pageStatus.textContent =
          "Search could not load. Check your connection and try again.";
    }
  }
  pageInput.value = new URL(location.href).searchParams.get("q") ?? "";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void updatePage();
  });
  pageInput.addEventListener("input", () => void updatePage());
  void updatePage();
}
