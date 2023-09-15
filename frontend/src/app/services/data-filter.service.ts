import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {
  
  sort(data: any[], column: string, direction: string = 'asc'): any[] {
    const sortedData = sortBy(data, [column]);
    if (direction === 'desc') {
      sortedData.reverse();
    }
    return sortedData;
  }

  paginate(data: any[], pageSize: number, currentPage: number): any[] {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }

  filterByKeyword(data: any[], keyword: string, field: string): any[] {
    return data.filter(item => item[field].toLowerCase().includes(keyword.toLowerCase()));
  }

}
