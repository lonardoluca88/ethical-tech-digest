
import React, { useState } from 'react';
import { NewsSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import AddEditSourceDialog from './sources/AddEditSourceDialog';
import SourcesTable from './sources/SourcesTable';
import { NewsFetchingService } from '@/lib/newsFetchingService';

interface SourcesManagerProps {
  sources: NewsSource[];
  onUpdate: (sources: NewsSource[]) => void;
}

const SourcesManager: React.FC<SourcesManagerProps> = ({ sources, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentSource, setCurrentSource] = useState<Partial<NewsSource>>({
    name: '',
    url: '',
    reliability: 7
  });
  const [editMode, setEditMode] = useState(false);

  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    
    try {
      const result = await NewsFetchingService.refreshNews();
      
      if (result.success) {
        toast.success(`Ricerca notizie completata: ${result.newArticlesCount} nuovi articoli trovati`);
      } else {
        toast.error(`Errore durante la ricerca: ${result.message}`);
      }
    } catch (error) {
      toast.error('Errore durante la ricerca delle notizie');
      console.error('Error refreshing news:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenDialog = (source?: NewsSource) => {
    if (source) {
      setCurrentSource(source);
      setEditMode(true);
    } else {
      setCurrentSource({
        name: '',
        url: '',
        reliability: 7
      });
      setEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSource({ ...currentSource, [name]: value });
  };

  const handleReliabilityChange = (value: number[]) => {
    setCurrentSource({ ...currentSource, reliability: value[0] });
  };

  const handleSave = () => {
    if (!currentSource.name || !currentSource.url) {
      toast.error('Nome e URL sono campi obbligatori');
      return;
    }

    if (editMode) {
      const updatedSources = sources.map(source => 
        source.id === currentSource.id ? { ...currentSource as NewsSource } : source
      );
      onUpdate(updatedSources);
      toast.success('Fonte aggiornata con successo');
    } else {
      const newSource: NewsSource = {
        id: crypto.randomUUID(),
        name: currentSource.name,
        url: currentSource.url,
        reliability: currentSource.reliability || 7
      };
      onUpdate([...sources, newSource]);
      toast.success('Fonte aggiunta con successo');
      
      // Clear form after successful addition
      setCurrentSource({
        name: '',
        url: '',
        reliability: 7
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa fonte?')) {
      const updatedSources = sources.filter(source => source.id !== id);
      onUpdate(updatedSources);
      toast.success('Fonte eliminata con successo');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestione Fonti</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshNews} 
            size="sm"
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Aggiorna Notizie
          </Button>
          <Button onClick={() => handleOpenDialog()} size="sm">
            <Plus size={16} className="mr-1" />
            Aggiungi Fonte
          </Button>
        </div>
      </div>
      
      <SourcesTable 
        sources={sources}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />
      
      <AddEditSourceDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentSource={currentSource}
        onChange={handleChange}
        onReliabilityChange={handleReliabilityChange}
        onSave={handleSave}
        editMode={editMode}
      />
    </Card>
  );
};

export default SourcesManager;
