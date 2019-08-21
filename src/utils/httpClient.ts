import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

axios.defaults.withCredentials = true;

export default class HttpClient {
  public async get(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'get',
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async post(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'post',
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async put(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'put',
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async patch(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'patch',
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async delete(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'delete',
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async head(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'head',
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  private async _sendRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await axios(config);
    } catch (err) {
      throw err;
    }
  }
}
