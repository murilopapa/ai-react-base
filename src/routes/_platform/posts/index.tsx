import { Badge, Box, Flex, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEye, LuHeart, LuHeartOff } from 'react-icons/lu';

import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';
import { Button } from '@/shared/components/ui/button';
import { iconSizes } from '@/shared/theme/theme';
import { postController } from './-post.controller';

const LIMIT = 10;

export const Route = createFileRoute('/_platform/posts/')({
  component: PostsPage,
});

function PostsPage() {
  const { t } = useTranslation();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useSetPlatformHeader({ title: t('screens.posts.title') });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => postController.list({ limit: LIMIT, skip: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });

  // Auto-load on scroll into view
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Box maxW="3xl">
      {isLoading ? (
        <Flex justify="center" py="16">
          <Spinner color="app.primary" size="xl" />
        </Flex>
      ) : (
        <VStack gap="4" align="stretch">
          {allPosts.map((post) => (
            <Link
              key={post.id}
              to="/posts/$postId"
              params={{ postId: String(post.id) }}
              style={{ textDecoration: 'none' }}>
              <Box
                p="6"
                bg="app.surface-dark"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="app.surface-border"
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ borderColor: 'app.primary', bg: 'app.primary/5' }}>
                <Text fontWeight="semibold" fontSize="lg" color="white" mb="2">
                  {post.title}
                </Text>
                <Text color="gray.400" fontSize="sm" mb="4" lineClamp={2}>
                  {post.body}
                </Text>

                <HStack gap="2" flexWrap="wrap" mb="3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} size="sm" colorPalette="blue" variant="subtle">
                      {tag}
                    </Badge>
                  ))}
                </HStack>

                <HStack gap="4" color="gray.500" fontSize="sm">
                  <HStack gap="1">
                    <LuEye size={iconSizes.s14} />
                    <Text>
                      {post.views} {t('screens.posts.views')}
                    </Text>
                  </HStack>
                  <HStack gap="1">
                    <LuHeart size={iconSizes.s14} />
                    <Text>
                      {post.reactions.likes} {t('screens.posts.likes')}
                    </Text>
                  </HStack>
                  <HStack gap="1">
                    <LuHeartOff size={iconSizes.s14} />
                    <Text>
                      {post.reactions.dislikes} {t('screens.posts.dislikes')}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
            </Link>
          ))}

          {/* Sentinel for IntersectionObserver */}
          <Box ref={sentinelRef} py="2" />

          {isFetchingNextPage && (
            <Flex justify="center" py="4">
              <Spinner color="app.primary" />
            </Flex>
          )}

          {!hasNextPage && allPosts.length > 0 && (
            <Text textAlign="center" color="gray.500" fontSize="sm" py="4">
              {t('screens.posts.no_more')}
            </Text>
          )}

          {hasNextPage && !isFetchingNextPage && (
            <Flex justify="center">
              <Button
                variant="outline"
                colorPalette="blue"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}>
                {t('screens.posts.load_more')}
              </Button>
            </Flex>
          )}
        </VStack>
      )}
    </Box>
  );
}
