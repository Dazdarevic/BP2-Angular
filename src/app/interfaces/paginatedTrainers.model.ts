import { Trainer } from "./trainer.model";

export interface PaginatedTrainers {
  items: any[];
  trainers: Trainer[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}
