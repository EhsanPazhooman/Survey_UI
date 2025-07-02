import BaseAxios from './BaseAxios'

class BaseApi {
  constructor(resource) {
    this.resource = resource
  }

  getAll(params = {}) {
    const url = BaseAxios.buildUrl(this.resource, params)
    return BaseAxios.get(url)
  }

  getById(id, params = {}) {
    const url = BaseAxios.buildUrl(`${this.resource}/${id}`, params)
    return BaseAxios.get(url)
  }

  create(data) {
    return BaseAxios.post(this.resource, data)
  }

  update(id, data) {
    return BaseAxios.put(`${this.resource}/${id}`, data)
  }

  delete(id) {
    return BaseAxios.delete(`${this.resource}/${id}`)
  }

  // Optionally, add a method for file upload
  uploadFile(id, fileData) {
    return BaseAxios.postFile(`${this.resource}/${id}/upload`, fileData)
  }
}

export default BaseApi
