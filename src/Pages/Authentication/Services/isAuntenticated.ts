

export class IsAuthenticatedService {
    isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}