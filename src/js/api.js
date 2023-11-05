import axios from 'axios';

const apiKey = '40461554-615dcd3ac736ed83d077c5b83';
const perPage = 40;

export const searchImages = async (searchQuery, page) => {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні даних:', error);
    return null;
  }
};
