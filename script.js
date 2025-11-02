$(document).ready(function () {
    const newsContainer = $('#news-container');
    const searchInput = $('#search-input');
    const searchButton = $('#search-button');
    const loader = $('#loader');

    const fetchNews = (query) => {
        loader.removeClass('d-none').addClass('d-flex');
        newsContainer.hide();

        $.ajax({
            url: `/api/news?q=${query}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                displayNews(data.articles);
            },
            error: function (error) {
                console.error("Error fetching news:", error);
                newsContainer.html(`<p class="text-center fs-4">Gagal memuat berita. ${error.statusText}</p>`);
            },
            complete: function () {
                loader.removeClass('d-flex').addClass('d-none');
                newsContainer.show();
            }
        });
    };

    const displayNews = (articles) => {
        newsContainer.empty();

        if (!articles || articles.length === 0) {
            newsContainer.html('<p class="text-center fs-4">Tidak ada berita yang ditemukan.</p>');
            return;
        }

        articles.forEach(article => {
            if (!article.title || !article.description) return;

            const placeholderImage = 'https://via.placeholder.com/400x250.png?text=No+Image';

            const newsCard = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${article.urlToImage || placeholderImage}" class="card-img-top" alt="News Image">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Baca Selengkapnya</a>
                        </div>
                    </div>
                </div>
            `;
            newsContainer.append(newsCard);
        });
    };

    searchButton.on('click', () => {
        const query = searchInput.val().trim();
        if (query) {
            fetchNews(query);
        }
    });

    searchInput.on('keydown', (event) => {
        if (event.key === 'Enter') {
            searchButton.trigger('click');
        }
    });

    $('.category-link').on('click', function (e) {
        e.preventDefault();
        const category = $(this).data('category');
        fetchNews(category);
    });

    fetchNews('indonesia');
});