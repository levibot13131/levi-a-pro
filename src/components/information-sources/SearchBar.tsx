
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-end">
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="חיפוש..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pr-10 text-right"
        />
      </div>
    </div>
  );
};

export default SearchBar;
