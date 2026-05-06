export default {
  routes: [
    {
     method: 'POST',
     path: '/editorjs/uploadImage',
     handler: 'editorjs.uploadImage',
     config: {
        policies: ['global::editorjs-upload'],
        middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/editorjs/uploadVideo',
     handler: 'editorjs.uploadVideo',
      config: {
        policies: ['global::editorjs-upload'],
        middlewares: [],
      },
    },
    {
     method: 'POST',
     path: '/editorjs/uploadFile',
     handler: 'editorjs.uploadFile',
      config: {
        policies: ['global::editorjs-upload'],
        middlewares: [],
      },
    },
    {
     method: 'POST',
     path: '/editorjs/fetchUrl',
     handler: 'editorjs.fetchUrl',
      config: {
        policies: ['global::editorjs-upload'],
        middlewares: [],
      },
    },
  ],
};
