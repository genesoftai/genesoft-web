import React, { useState } from 'react';
// import { FaGithub } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getGithubInstallationId } from '@/actions/integration';
import { toast } from 'sonner';
interface GithubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositories: any[];
  onSelectRepository: (repository: any) => void;
}

const GithubImportModal: React.FC<GithubImportModalProps> = ({
  isOpen,
  onClose,
  repositories,
  onSelectRepository,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRepoSelect = async (repo: any) => {
    setSelectedRepo(repo);
    console.log("repo", repo);
    // check it have installationId or not
    try{
      const installationId =  await getGithubInstallationId(repo.owner.login, repo.name);
      // example response 
      // {
      //   "installationId": 66721556
      // }
      if (installationId == null) {
        toast.error("Please install the Github App on the repository");
      }else {
        console.log("installationId", installationId);
      }
    } catch (error) {
      console.error("Error getting Github installation ID", error);
      toast.error("Error getting Github installation ID");
    }
  };

  const handleImport = () => {
    if (selectedRepo) {
      onSelectRepository(selectedRepo);
      onClose();
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
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

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
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{repo.name}</span>
                        {repo.private && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                      
                      {repo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {repo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {repo.language && (
                          <span>{repo.language}</span>
                        )}
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
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
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!selectedRepo}
          >
            Import Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GithubImportModal;
