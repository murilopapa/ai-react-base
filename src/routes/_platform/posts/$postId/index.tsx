import { Badge, Box, Flex, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuEye, LuHeart, LuHeartOff } from 'react-icons/lu';

import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';
import { iconSizes } from '@/shared/theme/theme';
import { postController } from '../-post.controller';

export const Route = createFileRoute('/_platform/posts/$postId/')({
  component: PostDetailPage,
});

function PostDetailPage() {
  const { t } = useTranslation();
  const { postId } = Route.useParams();
  const id = Number(postId);

  useSetPlatformHeader({ title: t('screens.post_detail.title') });

  const { data: post, isLoading } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => postController.getById(id),
    enabled: !Number.isNaN(id),
  });

  if (isLoading) {
    return (
      <Flex justify="center" py="16">
        <Spinner color="app.primary" size="xl" />
      </Flex>
    );
  }

  if (!post) {
    return <Text color="gray.400">{t('common.error')}</Text>;
  }

  return (
    <Box maxW="3xl">
      <Link to="/posts" style={{ textDecoration: 'none' }}>
        <HStack
          gap="2"
          color="app.primary"
          mb="6"
          _hover={{ opacity: 0.8 }}
          transition="opacity 0.15s">
          <LuArrowLeft size={iconSizes.s16} />
          <Text fontSize="sm">{t('screens.post_detail.back')}</Text>
        </HStack>
      </Link>

      <Box
        p="8"
        bg="app.surface-dark"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="app.surface-border">
        <VStack align="stretch" gap="6">
          <Text fontWeight="bold" fontSize="2xl" color="white" lineHeight="tight">
            {post.title}
          </Text>

          <Text color="gray.300" fontSize="md" lineHeight="tall">
            {post.body}
          </Text>

          <Box borderTop="1px solid" borderColor="app.surface-border" pt="6">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="wider"
              mb="3">
              {t('screens.post_detail.tags')}
            </Text>
            <HStack gap="2" flexWrap="wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} colorPalette="blue" variant="subtle">
                  {tag}
                </Badge>
              ))}
            </HStack>
          </Box>

          <Box borderTop="1px solid" borderColor="app.surface-border" pt="6">
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="wider"
              mb="4">
              {t('screens.post_detail.reactions')}
            </Text>
            <HStack gap="6">
              <HStack gap="2" color="gray.300">
                <LuEye size={iconSizes.s18} />
                <VStack gap="0" align="start">
                  <Text fontWeight="semibold" color="white">
                    {post.views}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {t('screens.post_detail.views')}
                  </Text>
                </VStack>
              </HStack>
              <HStack gap="2" color="gray.300">
                <LuHeart size={iconSizes.s18} />
                <VStack gap="0" align="start">
                  <Text fontWeight="semibold" color="white">
                    {post.reactions.likes}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {t('screens.posts.likes')}
                  </Text>
                </VStack>
              </HStack>
              <HStack gap="2" color="gray.300">
                <LuHeartOff size={iconSizes.s18} />
                <VStack gap="0" align="start">
                  <Text fontWeight="semibold" color="white">
                    {post.reactions.dislikes}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {t('screens.posts.dislikes')}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
