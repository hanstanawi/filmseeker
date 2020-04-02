const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

	const searchBar = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultWrapper = root.querySelector('.results');

	// Search fetch function
	const onInput = async (event) => {
		try {
			const items = await fetchData(event.target.value);

			if (!items.length) {
				dropdown.classList.remove('is-active');
				return;
			}

			dropdown.classList.add('is-active');
			resultWrapper.innerHTML = '';

			for (let item of items) {
				const option = document.createElement('a');

				option.classList.add('dropdown-item');
				option.innerHTML = renderOption(item);

				option.addEventListener('click', () => {
					dropdown.classList.remove('is-active');
					searchBar.value = inputValue(item);
					onOptionSelect(item);
				});

				resultWrapper.appendChild(option);
			}
		} catch (err) {
			console.log('Something went wrong', err);
		}
	};

	searchBar.addEventListener('input', debounce(onInput, 500));

	document.addEventListener('click', (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
