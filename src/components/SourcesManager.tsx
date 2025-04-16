import React, { useState } from 'react';
import { NewsSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { Pencil, Trash2, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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
    const keywords = ['AI', 'Ethics', 'Robotics', 'Biotechnology'];
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Ricerca notizie completata con successo');
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
                        onClick={() => handleOpenDialog(source)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(source.id)}
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Modifica Fonte' : 'Aggiungi Fonte'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={currentSource.name || ''}
                onChange={handleChange}
                placeholder="Nome della fonte"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={currentSource.url || ''}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reliability">
                Affidabilità: {currentSource.reliability}/10
              </Label>
              <Slider
                id="reliability"
                min={1}
                max={10}
                step={1}
                value={[currentSource.reliability || 7]}
                onValueChange={handleReliabilityChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSave}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SourcesManager;
