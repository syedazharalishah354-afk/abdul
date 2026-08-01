import { generateAllJobs } from './jobGenerator';
import { JobCategory, Job } from '../types';

const generatedData = generateAllJobs();

export const POPULAR_CATEGORIES: JobCategory[] = generatedData.categories;
export const MOCK_JOBS: Job[] = generatedData.jobs;
