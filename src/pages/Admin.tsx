import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NewsItem, NewsSource, AppSettings } from '@/lib/types';
import { dummyNews, dummySources, defaultAppSettings } from '@/lib/dummyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, FileText, PaintBucket, Mail, HelpCircle, RefreshCw } from 'lucide-react';
import AdminNewsForm from '@/components/AdminNewsForm';
import SourcesManager from '@/components/SourcesManager';
import StylesCustomizer from '@/components/StylesCustomizer';
import EmailSettings from '@/components/EmailSettings';
import InstallationGuide from '@/components/InstallationGuide';
import { toast } from 'sonner';
import { CategoryIcon, getCategoryName } from '@/components/icons/CategoryIcons';
import { NewsFetchingService } from '@/lib/newsFetchingService';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news',
  SOURCES: 'ethicalTechDigest_sources',
  SETTINGS: 'ethicalTechDigest_settings'
};

const Admin = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentNewsItem, setCurrentNewsItem] = useState<NewsItem | undefined>();
  const [activeTab, setActiveTab] = useState("news");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const savedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
    const savedSources = localStorage.getItem(STORAGE_KEYS.SOURCES);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    
    setNews(savedNews ? JSON.parse(savedNews) : dummyNews);
    setSources(savedSources ? JSON.parse(savedSources) : dummySources);
    setSettings(savedSettings ? JSON.parse(savedSettings) : defaultAppSettings);
  }, []);
  
  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    }
  }, [news]);
  
  useEffect(() => {
    if (sources.length > 0) {
      localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
    }
  }, [sources]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);
  
  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    
    try {
      const result = await NewsFetchingService.refreshNews();
      
      if (result.success) {
        const updatedNewsStr = localStorage.getItem(STORAGE_KEYS.NEWS);
        if (updatedNewsStr) {
          setNews(JSON.parse(updatedNewsStr));
        }
        
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
  
  const handleEditNews = (newsItem: NewsItem) => {
    setCurrentNewsItem(newsItem);
    setIsDialogOpen(true);
  };
  
  const handleAddNews = () => {
    setCurrentNewsItem(undefined);
    setIsDialogOpen(true);
  };
  
  const handleDeleteNews = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa notizia?')) {
      setNews(news.filter(item => item.id !== id));
      toast.success('Notizia eliminata con successo');
    }
  };
  
  const handleSaveNews = (newsItem: NewsItem) => {
    if (currentNewsItem) {
      setNews(news.map(item => item.id === newsItem.id ? newsItem : item));
      toast.success('Notizia aggiornata con successo');
    } else {
      setNews([...news, newsItem]);
      toast.success('Notizia aggiunta con successo');
    }
    setIsDialogOpen(false);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleUpdateSources = (updatedSources: NewsSource[]) => {
    setSources(updatedSources);
  };
  
  const handleUpdateSettings = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getSourceName = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    return source?.name || 'Sconosciuta';
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Pannello di Amministrazione
          </h1>
          <p className="text-muted-foreground">
            Gestisci le notizie, le fonti e le impostazioni del widget
          </p>
        </div>
        
        <Tabs 
          defaultValue="news" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="news" className="flex items-center gap-1">
              <FileText size={16} />
              <span className="hidden sm:inline">Notizie</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <Pencil size={16} />
              <span className="hidden sm:inline">Fonti</span>
            </TabsTrigger>
            <TabsTrigger value="styles" className="flex items-center gap-1">
              <PaintBucket size={16} />
              <span className="hidden sm:inline">Stili</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail size={16} />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-1">
              <HelpCircle size={16} />
              <span className="hidden sm:inline">Guida</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="border-none p-0 mt-4">
            <div className="flex justify-end mb-4 gap-2">
              <Button 
                onClick={handleRefreshNews} 
                className="flex items-center gap-1" 
                variant="outline"
                disabled={isRefreshing || sources.length === 0}
              >
                <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Ricerca in corso...' : 'Ricerca Notizie'}
              </Button>
              
              <Button onClick={handleAddNews} className="flex items-center gap-1" disabled={sources.length === 0}>
                <Plus size={16} />
                Aggiungi Notizia
              </Button>
            </div>
            
            {sources.length === 0 && (
              <div className="mb-4 p-3 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-md">
                <p>Prima di aggiungere notizie, devi creare almeno una fonte nella sezione Fonti.</p>
              </div>
            )}
            
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="w-full">Titolo</TableHead>
                    <TableHead>Fonte</TableHead>
                    <TableHead className="w-[100px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nessuna notizia disponibile
                      </TableCell>
                    </TableRow>
                  ) : (
                    news.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CategoryIcon category={item.category} size={16} />
                            <span className="hidden md:inline">{getCategoryName(item.category)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{getSourceName(item.sourceId)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditNews(item)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteNews(item.id)}
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
          </TabsContent>
          
          <TabsContent value="sources" className="border-none p-0">
            <SourcesManager 
              sources={sources}
              onUpdate={handleUpdateSources}
            />
          </TabsContent>
          
          <TabsContent value="styles" className="border-none p-0">
            <StylesCustomizer 
              settings={settings}
              onUpdate={handleUpdateSettings}
            />
          </TabsContent>
          
          <TabsContent value="email" className="border-none p-0">
            <EmailSettings
              settings={settings}
              onUpdate={handleUpdateSettings}
            />
          </TabsContent>
          
          <TabsContent value="guide" className="border-none p-0">
            <InstallationGuide />
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <AdminNewsForm 
            onSave={handleSaveNews}
            onCancel={handleCloseDialog}
            initialData={currentNewsItem}
            sources={sources}
          />
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Admin;
