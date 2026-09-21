import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    const select = elements[elementName];
    if (!select) return;

    select.append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      const target = action
        .closest(".filter-wrapper")
        ?.querySelector("input, select");

      if (target) {
        target.value = "";
      }

      if (field) {
        state[field] = "";
      }
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((row) => {
      if (state.date && !compare(row, { date: state.date })) {
        return false;
      }

      if (state.customer && !compare(row, { customer: state.customer })) {
        return false;
      }

      if (state.seller && !compare(row, { seller: state.seller })) {
        return false;
      }

      const totalFromRaw = state.totalFrom ?? "";
      const totalFrom = totalFromRaw === "" ? null : Number(totalFromRaw);
      if (
        totalFrom !== null &&
        !Number.isNaN(totalFrom) &&
        Number(row.total) < totalFrom
      ) {
        return false;
      }

      const totalToRaw = state.totalTo ?? "";
      const totalTo = totalToRaw === "" ? null : Number(totalToRaw);
      if (
        totalTo !== null &&
        !Number.isNaN(totalTo) &&
        Number(row.total) > totalTo
      ) {
        return false;
      }

      return true;
    });
  };
}
