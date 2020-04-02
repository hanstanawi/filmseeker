// Navbar
const header = document.getElementById('header');
header.innerHTML = navbar();

// AutoComplete Function
const autoCompleteConfig = {
	renderOption(series) {
		const imgSrc = series.Poster === 'N/A' ? '' : series.Poster;
		return `
		<img src="${imgSrc}"/>
		${series.Title} (${series.Year})
	`;
	},
	inputValue(series) {
		return series.Title;
	},
	async fetchData(searchTerm) {
		try {
			const res = await axios.get('http://www.omdbapi.com/', {
				params: {
					apikey: '53462c4c',
					s: searchTerm,
					type: 'series'
				}
			});
			const { Search, Error } = res.data;

			if (Error) {
				console.log(Error);
				return [];
			}

			return Search;
		} catch (err) {
			console.log('Something wrong happened', err);
		}
	}
};

// Left Movie
createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#autocomplete-left'),
	onOptionSelect(series) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onSeriesSelect(series, document.querySelector('#summary-left'), 'left');
	}
});

// Right Movie
createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#autocomplete-right'),
	onOptionSelect(series) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onSeriesSelect(series, document.querySelector('#summary-right'), 'right');
	}
});

let leftSeries;
let rightSeries;
const onSeriesSelect = async (series, summaryElement, side) => {
	try {
		const res = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: '53462c4c',
				i: series.imdbID
			}
		});

		console.log(res.data);

		summaryElement.innerHTML = seriesTemplate(res.data);

		if (side === 'left') {
			leftSeries = res.data;
		} else {
			rightSeries = res.data;
		}

		if (leftSeries && rightSeries) {
			runComparison();
		}
	} catch (err) {
		console.log('Something went wrong', err);
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#summary-left .notification');
	const rightSideStats = document.querySelectorAll('#summary-right .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			rightStat.classList.remove('is-info');
			rightStat.classList.add('is-success');
		} else {
			leftStat.classList.remove('is-info');
			leftStat.classList.add('is-success');
		}
	});
};

const seriesTemplate = (seriesDetail) => {
	const meta = parseInt(seriesDetail.Metascore);
	const imdbRating = parseFloat(seriesDetail.imdbRating);
	const votes = parseInt(seriesDetail.imdbVotes.replace(/,/g, ''));

	const awards = seriesDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${seriesDetail.Poster}" />
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h2>${seriesDetail.Title} (${seriesDetail.Year})</h2>
					<h5>${seriesDetail.Genre}</h5>
					<p>${seriesDetail.Plot}</p>
				</div>
			</div>
		</article>
		<article data-value=${imdbRating} class="notification is-info">
			<p class="title">${seriesDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${meta} class="notification is-info">
			<p class="title">${seriesDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${votes} class="notification is-info">
			<p class="title">${seriesDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
		<article data-value=${awards} class="notification is-info">
			<p class="title">${seriesDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
	`;
};
