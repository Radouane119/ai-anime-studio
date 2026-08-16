export type AnimeGenre = 
  | 'shonen' 
  | 'seinen' 
  | 'isekai' 
  | 'cyberpunk' 
  | 'slice_of_life' 
  | 'mecha' 
  | 'fantasy' 
  | 'romance';

export type ProductionFormat = 
  | 'light_novel' 
  | 'manga_webtoon' 
  | 'anime_storyboard' 
  | 'short_anime_film';

export interface SharedUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CREATOR' | 'MEMBER';
}

export interface SharedProject {
  id: string;
  title: string;
  tagline: string;
  genre: AnimeGenre;
  format: ProductionFormat;
  createdAt: string;
}
