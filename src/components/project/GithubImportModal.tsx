import React, { useState, useEffect } from 'react';
// import { FaGithub } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getGithubInstallationId } from '@/actions/integration';
import { toast } from 'sonner';
import { CheckCircle2 } from "lucide-react";

interface GithubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubAccessToken: string;
  onSelectRepository: (repository: any) => void;
}

const GithubImportModal: React.FC<GithubImportModalProps> = ({
  isOpen,
  onClose,
  githubAccessToken,
  onSelectRepository,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [installedRepos, setInstalledRepos] = useState<Record<string, number>>({});
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  useEffect(() => {
    const fetchAllRepos = async () => {
      if (!githubAccessToken || !isOpen) return;
      setLoadingRepos(true);
      let allRepos: any[] = [];
      let page = 1;
      let hasNext = true;
      while (hasNext) {
        const res = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${githubAccessToken}`,
              Accept: "application/vnd.github+json",
            },
          }
        );
        const repos = await res.json();
        if (Array.isArray(repos) && repos.length > 0) {
          allRepos = allRepos.concat(repos);
          if (repos.length < 100) {
            hasNext = false;
          } else {
            page++;
          }
        } else {
          hasNext = false;
        }
      }
      setRepositories(allRepos);
      setLoadingRepos(false);
    };
    fetchAllRepos();
  }, [githubAccessToken, isOpen]);

  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRepoSelect = async (repo: any) => {
    setSelectedRepo(repo);
    console.log("repo", repo);
    try {
      const resData = await getGithubInstallationId(repo.owner.login, repo.name);
      if (resData?.installationId == null || resData.installationId == '') {
        console.log("installationId not exist");
        toast.error("Please install the Github App on the repository");
      } else {
        console.log("installationId", resData.installationId);
        setInstalledRepos(prev => ({
          ...prev,
          [repo.id]: resData.installationId
        }));
      }
    } catch (error) {
      console.error("Error getting Github installation ID", error);
      toast.error("Error getting Github installation ID");
    }
  };

  const handleImport = () => {
    if (selectedRepo && installedRepos[selectedRepo.id]) {
      onSelectRepository({
        ...selectedRepo,
        installationId: installedRepos[selectedRepo.id]
      });
      onClose();
    } else {
      toast.error("Please install the Github App on the repository first");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {/* <FaGithub className="h-6 w-6" /> */}
            Import from GitHub
           
          </DialogTitle>
          <DialogDescription>
            <div className="">
              must install <a href="https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps" target="_blank" rel="noopener noreferrer">
                <u><b>Github App</b></u>
              </a> before able to import
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          {loadingRepos ? (
            <div className="flex items-center justify-center h-[400px]">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
              <span>Loading repositories...</span>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border">
              {filteredRepos.length > 0 ? (
                <div className="divide-y">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className={cn(
                        "p-4 cursor-pointer transition-colors hover:bg-muted/50",
                        selectedRepo?.id === repo.id && "bg-muted"
                      )}
                      onClick={() => handleRepoSelect(repo)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{repo.name}</span>
                            {repo.private && (
                              <Badge variant="secondary" className="text-xs">
                                Private
                              </Badge>
                            )}
                            {installedRepos[repo.id] && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          {!installedRepos[repo.id] && (
                            <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100">
                              Install App
                            </Button>
                          )}
                        </div>
                        
                        {repo.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No repositories found
                </div>
              )}
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!selectedRepo || !installedRepos[selectedRepo.id]}
          >
            Import Repository 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GithubImportModal;
