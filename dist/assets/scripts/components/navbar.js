const navbar = () => {
	return `
    <section class="hero is-info is-bold">
    <div class="hero-head">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item">
              <img src="../img/logo_white.png" alt="Logo" id="logo">
            </a>
          </div>
          <div class="navbar-end">
            <a href="/dist/views/movies.html" class="navbar-item">
              <i class="fas fa-film"></i>Films
            </a>
            <a href="/dist/views/series.html" class="navbar-item">
              <i class="fas fa-tv"></i> TV Series
            </a>
          </div>
        </div>
      </nav>
    </div>  
  </section>
    `;
};
