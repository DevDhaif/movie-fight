const CreateAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData
}) => {
  root.innerHTML = `
<input
          class="searchBtn"
          type="text"
          name=""
          id="search1"
          placeholder="search here"
        />
        <!-- First DropDown -->
        <div id="dropdown" class="hidden max-w-sm" >
        <div id="results" class=" mt-2 py-2 w-full">
            <a class="anchor" href="#">
            <h1>ha</h1>
            <h1>ha</h1>
             </a>
        </div>
        </div>
`;
  const input1 = root.querySelector("#search1");
  let dropdown = root.querySelector("#dropdown");
  const results = root.querySelector("#results");

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    if (!items.length) {
      dropdown.classList.add("hidden");
    }
    dropdown.classList.remove("hidden");
    results.innerHTML = "";
    for (let item of items) {
      const anchor = document.createElement("a");

      anchor.innerHTML = renderOption(item);
      anchor.addEventListener("click", () => {
        dropdown.classList.add("hidden");
        input1.value = inputValue(item);
        onOptionSelect(item);
      });
      results.appendChild(anchor);
      anchor.classList.add("anchor");
    }
  };
  input1.addEventListener("input", debounce(onInput, 900));
  // fetchData()
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target) && !input1.contains(event.target)) {
      dropdown.classList.add("hidden");
    }
  });
};
