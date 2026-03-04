
export class GetTokenService {
      getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
