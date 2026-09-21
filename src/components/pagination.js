import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows, rowsPerPage },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  return (data, state, action) => {
    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
    const rowsPerPageValue =
      Number.parseInt(state.rowsPerPage ?? rowsPerPage.value ?? "10", 10) || 10;
    const pageCount = Math.max(1, Math.ceil(data.length / rowsPerPageValue));
    let page = Number.parseInt(state.page ?? "1", 10) || 1;

    // @todo: #2.6 — обработать действия
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
        default:
          break;
      }
    }

    page = Math.min(Math.max(1, page), pageCount);

    // @todo: #2.4 — получить список видимых страниц и вывести их
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // @todo: #2.5 — обновить статус пагинации
    fromRow.textContent =
      data.length === 0 ? 0 : (page - 1) * rowsPerPageValue + 1;
    toRow.textContent =
      data.length === 0 ? 0 : Math.min(page * rowsPerPageValue, data.length);
    totalRows.textContent = data.length;

    // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    const skip = (page - 1) * rowsPerPageValue;
    return data.slice(skip, skip + rowsPerPageValue);
  };
};
