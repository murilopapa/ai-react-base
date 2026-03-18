import { Box, HStack, Input, NativeSelect, Table, Text, VStack } from '@chakra-ui/react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import type { ReactNode } from 'react';
import { LuChevronLeft, LuChevronRight, LuSearch } from 'react-icons/lu';

import { Button } from '@/shared/components/ui/button';
import { CardBody, CardFooter, CardRoot } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { iconSizes } from '@/shared/theme/theme';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render: (row: T) => ReactNode;
};

type DataTableState = {
  search: string;
  page: number;
  limit: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export function useDataTable(options?: { defaultLimit?: number }): DataTableState {
  const [{ search, page, limit }, setParams] = useQueryStates(
    {
      search: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(0),
      limit: parseAsInteger.withDefault(options?.defaultLimit ?? 10),
    },
    { history: 'push' },
  );

  return {
    search,
    page,
    limit,
    onSearchChange: (value) => void setParams({ search: value || null, page: 0 }),
    onPageChange: (p) => void setParams({ page: p }),
    onLimitChange: (l) => void setParams({ limit: l, page: 0 }),
  };
}

type PageEntry = { key: string; value: number | '...' };

function buildPageList(page: number, totalPages: number): PageEntry[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({ key: `page-${i}`, value: i }));
  }
  const set = new Set<number>([0, totalPages - 1, page]);
  if (page > 0) set.add(page - 1);
  if (page < totalPages - 1) set.add(page + 1);

  const sorted = Array.from(set).sort((a, b) => a - b);
  const result: PageEntry[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push({ key: `ellipsis-before-${sorted[i]}`, value: '...' });
    }
    result.push({ key: `page-${sorted[i]}`, value: sorted[i] });
  }
  return result;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];
const LOADING_ROWS = 5;
const SKELETON_ROW_IDS = Array.from({ length: LOADING_ROWS }, (_, i) => `skeleton-row-${i}`);

type DataTableProps<T> = DataTableState & {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  total: number;
  totalPages: number;
  searchPlaceholder?: string;
  headerActions?: ReactNode;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  showingText?: string;
  showingZeroText?: string;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  total,
  totalPages,
  search,
  page,
  limit,
  onSearchChange,
  onPageChange,
  onLimitChange,
  searchPlaceholder,
  headerActions,
  emptyIcon,
  emptyMessage,
  showingText,
  showingZeroText,
  rowKey,
  onRowClick,
}: Readonly<DataTableProps<T>>) {
  const colCount = columns.length;
  const pageList = buildPageList(page, totalPages);

  let tableBody: ReactNode;
  if (isLoading) {
    tableBody = SKELETON_ROW_IDS.map((id) => (
      <Table.Row key={id} bg="transparent" borderColor="app.surface-border" borderBottomWidth="1px">
        {columns.map((col) => (
          <Table.Cell key={col.key} px="6" py="4">
            <Skeleton h="4" w="full" />
          </Table.Cell>
        ))}
      </Table.Row>
    ));
  } else if (data.length === 0) {
    tableBody = (
      <Table.Row bg="transparent" borderColor="transparent">
        <Table.Cell colSpan={colCount} textAlign="center" py="16">
          <VStack gap="3">
            {emptyIcon && <Box color="gray.600">{emptyIcon}</Box>}
            {emptyMessage && (
              <Text color="gray.500" fontSize="sm">
                {emptyMessage}
              </Text>
            )}
          </VStack>
        </Table.Cell>
      </Table.Row>
    );
  } else {
    tableBody = data.map((row, i) => (
      <Table.Row
        key={rowKey ? rowKey(row) : i}
        bg="transparent"
        borderColor="app.surface-border"
        borderBottomWidth="1px"
        _hover={{ bg: 'rgba(255,255,255,0.03)' }}
        cursor={onRowClick ? 'pointer' : undefined}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        transition="background 0.15s">
        {columns.map((col) => (
          <Table.Cell key={col.key} px="6" py="4" textAlign={col.align ?? 'left'}>
            {col.render(row)}
          </Table.Cell>
        ))}
      </Table.Row>
    ));
  }

  return (
    <>
      {(searchPlaceholder !== undefined || headerActions) && (
        <CardRoot bg="app.surface-dark" borderColor="app.surface-border" borderWidth="1px" mb="4">
          <CardBody px="4" py="3">
            <HStack justify="space-between" align="center">
              {searchPlaceholder === undefined ? (
                <Box />
              ) : (
                <Box position="relative" maxW="sm" flex="1">
                  <Box
                    position="absolute"
                    left="3"
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    pointerEvents="none"
                    zIndex="1">
                    <LuSearch size={iconSizes.s16} />
                  </Box>
                  <Input
                    pl="9"
                    bg="app.background-dark"
                    borderColor="app.surface-border"
                    color="white"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    _placeholder={{ color: 'gray.500' }}
                    _focus={{ borderColor: 'app.primary', boxShadow: 'none' }}
                  />
                </Box>
              )}
              {headerActions && (
                <HStack gap="2" flexShrink={0}>
                  {headerActions}
                </HStack>
              )}
            </HStack>
          </CardBody>
        </CardRoot>
      )}
      <CardRoot
        bg="app.surface-dark"
        borderColor="app.surface-border"
        borderWidth="1px"
        overflow="hidden">
        <CardBody p="0">
          <Box overflowX="auto">
            <Table.Root style={{ borderCollapse: 'collapse', width: '100%' }}>
              <Table.Header>
                <Table.Row
                  bg="rgba(255,255,255,0.03)"
                  borderColor="app.surface-border"
                  borderBottomWidth="1px">
                  {columns.map((col) => (
                    <Table.ColumnHeader
                      key={col.key}
                      color="gray.500"
                      fontWeight="semibold"
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      py="3"
                      px="6"
                      bg="transparent"
                      textAlign={col.align ?? 'left'}>
                      {col.header}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>{tableBody}</Table.Body>
            </Table.Root>
          </Box>
        </CardBody>
        <CardFooter
          px="6"
          py="4"
          bg="rgba(255,255,255,0.02)"
          borderTop="1px solid"
          borderColor="app.surface-border"
          display="flex"
          justifyContent="space-between"
          alignItems="center">
          <HStack gap="3">
            {isLoading ? (
              <Skeleton h="4" w="40" />
            ) : (
              <Text fontSize="sm" color="gray.400">
                {total === 0 ? (showingZeroText ?? '') : (showingText ?? '')}
              </Text>
            )}
            <NativeSelect.Root size="sm" w="auto">
              <NativeSelect.Field
                bg="app.background-dark"
                borderColor="app.surface-border"
                color="gray.300"
                fontSize="sm"
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </HStack>
          {totalPages > 0 && (
            <HStack gap="1">
              <Button
                size="xs"
                variant="ghost"
                color="gray.400"
                borderWidth="1px"
                borderColor="app.surface-border"
                disabled={page === 0}
                _hover={{ bg: 'rgba(255,255,255,0.06)', color: 'white' }}
                onClick={() => onPageChange(Math.max(0, page - 1))}>
                <LuChevronLeft size={iconSizes.s16} />
              </Button>
              {pageList.map(({ key, value }) =>
                value === '...' ? (
                  <Text key={key} fontSize="sm" color="gray.500" px="1">
                    …
                  </Text>
                ) : (
                  <Button
                    key={key}
                    size="xs"
                    variant={value === page ? 'solid' : 'ghost'}
                    colorPalette={value === page ? 'blue' : undefined}
                    color={value === page ? 'white' : 'gray.400'}
                    minW="9"
                    h="9"
                    _hover={value === page ? {} : { bg: 'rgba(255,255,255,0.06)', color: 'white' }}
                    onClick={() => onPageChange(value)}>
                    {value + 1}
                  </Button>
                ),
              )}
              <Button
                size="xs"
                variant="ghost"
                color="gray.400"
                borderWidth="1px"
                borderColor="app.surface-border"
                disabled={page >= totalPages - 1}
                _hover={{ bg: 'rgba(255,255,255,0.06)', color: 'white' }}
                onClick={() => onPageChange(page + 1)}>
                <LuChevronRight size={iconSizes.s16} />
              </Button>
            </HStack>
          )}
        </CardFooter>
      </CardRoot>
    </>
  );
}
