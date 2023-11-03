export const searchImages = async (searchQuery, page) => {
  const apiKey = '40461554-615dcd3ac736ed83d077c5b83';
  const perPage = 40;

  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Помилка при отриманні даних:', error);
    return null;
  }
};
