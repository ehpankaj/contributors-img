import { Contributor, Repository } from '@lib/core';
import { Octokit } from '@octokit/rest';
import { injectable } from 'tsyringe';

@injectable()
export class GitHubClient {
  constructor(private readonly octokit: Octokit) {}

  async getAllContributors(repository: Repository): Promise<Contributor[]> {
    let finalData: any[] = [];
    let lastPageReached = false;
    let pageCounter = 1;
    while (!lastPageReached) {
      const { data } = await this.octokit.repos.listContributors({
        owner: repository.owner,
        repo: repository.repo,
        per_page: 100,
        page: pageCounter,
      });
      finalData = [...finalData, ...data];
      pageCounter += 1;
      if (data.length == 0) {
        lastPageReached = true;
        pageCounter = 1;
      }
    }
    return finalData as Contributor[];
  }
}
