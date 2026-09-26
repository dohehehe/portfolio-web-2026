function compareFieldDesc(left, right) {
  if (left == null || left === "") {
    return right == null || right === "" ? 0 : 1;
  }

  if (right == null || right === "") {
    return -1;
  }

  if (typeof left === "number" && typeof right === "number") {
    return right - left;
  }

  const leftText = String(left);
  const rightText = String(right);

  const leftTime = Date.parse(leftText);
  const rightTime = Date.parse(rightText);

  if (!Number.isNaN(leftTime) && !Number.isNaN(rightTime)) {
    return rightTime - leftTime;
  }

  return rightText.localeCompare(leftText, undefined, { numeric: true });
}

function compareFieldAsc(left, right) {
  return compareFieldDesc(right, left);
}

/**
 * @param {object[]} items
 * @param {string | undefined} sortBy
 * @param {"asc" | "desc"} [sortOrder]
 */
export function sortAdminItems(items, sortBy, sortOrder = "desc") {
  if (!sortBy) {
    return [...items];
  }

  const compare =
    sortOrder === "asc" ? compareFieldAsc : compareFieldDesc;

  return [...items].sort((left, right) => {
    const byField = compare(left[sortBy], right[sortBy]);

    if (byField !== 0) {
      return byField;
    }

    const titleLeft = left.title_ko ?? left.email ?? "";
    const titleRight = right.title_ko ?? right.email ?? "";

    return titleLeft.localeCompare(titleRight);
  });
}

export function formatCellValue(value) {
  if (value == null || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    const json = JSON.stringify(value);

    if (json.length <= 80) {
      return json;
    }

    return `${json.slice(0, 80)}...`;
  }

  const text = String(value);

  if (text.length <= 80) {
    return text;
  }

  return `${text.slice(0, 80)}...`;
}
