// https://docs.strapi.io/dev-docs/providers#configuring-providers
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3', // For community providers pass the full package name (e.g. provider: 'strapi-provider-upload-google-cloud-storage')
      providerOptions: {
        baseUrl: env('SPACES_CDN_URL'),
        s3Options: {
          credentials: {
            accessKeyId: env('SPACES_ACCESS_KEY_ID'),
            secretAccessKey: env('SPACES_ACCESS_SECRET'),
          },
          endpoint: env('SPACES_ENDPOINT'),
          region: env('SPACES_REGION', 'us-east-1'),
          forcePathStyle: false,
          params: {
            ACL: env('SPACES_ACL', 'public-read'),
            Bucket: env('SPACES_BUCKET')
          }
        }
      },
    },
  },
});
