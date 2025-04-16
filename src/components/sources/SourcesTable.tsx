
import React from 'react';
import { NewsSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

interface SourcesTableProps {
  sources: NewsSource[];
  onEdit: (source: NewsSource) => void;
  onDelete: (id: string) => void;
}

const SourcesTable: React.FC<SourcesTableProps> = ({ sources, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Affidabilità</TableHead>
            <TableHead className="w-[100px]">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Nessuna fonte disponibile
              </TableCell>
            </TableRow>
          ) : (
            sources.map(source => (
              <TableRow key={source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {source.url}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{source.reliability}/10</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{width: `${(source.reliability / 10) * 100}%`}}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(source)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(source.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SourcesTable;
