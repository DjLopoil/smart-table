export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.entries(indexes).forEach(([elementName, values]) => {
      const select = elements[elementName];
      if (!select || !values) return;

      const currentValue = select.value;
      select.append(
        ...Object.values(values).map((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          return option;
        }),
      );
      select.value = currentValue;
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      const target = action
        .closest(".filter-wrapper, .dropdown-select")
        ?.querySelector("input, select");

      if (target) {
        target.value = "";
      }

      if (field) {
        state[field] = "";
      }
    }

    const filter = {};
    Object.keys(elements).forEach((key) => {
      const element = elements[key];

      if (element && ["INPUT", "SELECT"].includes(element.tagName) && element.value) {
        filter[`filter[${element.name}]`] = element.value;
      }
    });

    return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
