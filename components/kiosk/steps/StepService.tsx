import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { GrayButton } from '@/components/kiosk/GrayButton';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { FieldError } from '@/components/kiosk/FieldError';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { useKiosk } from '@/context/kiosk-context';
import { KioskColors } from '@/constants/kiosk-theme';
import type { ServiceTreeNode } from '@/services/api/types';
import { apiGetServicesByBranch } from '@/services/api/kiosk-api';

type TreeRowsProps = {
  nodes: ServiceTreeNode[];
  depth: number;
  ancestorNames: string[];
  expanded: Set<string>;
  toggle: (id: string) => void;
  selectedId: string | null;
  onSelectLeaf: (node: ServiceTreeNode, pathLabel: string) => void;
};

function TreeRows({
  nodes,
  depth,
  ancestorNames,
  expanded,
  toggle,
  selectedId,
  onSelectLeaf,
}: TreeRowsProps) {
  return (
    <>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isOpen = expanded.has(node.id);
        const selected = selectedId === node.id;
        const paddingLeft = 12 + depth * 14;

        return (
          <View key={node.id}>
            <Pressable
              onPress={() => {
                if (hasChildren) {
                  toggle(node.id);
                } else {
                  const pathLabel = [...ancestorNames, node.name].join(' > ');
                  onSelectLeaf(node, pathLabel);
                }
              }}
              style={({ pressed }) => [
                styles.nodeRow,
                { paddingLeft },
                selected && styles.nodeRowSelected,
                { opacity: pressed ? 0.92 : 1 },
              ]}>
              {hasChildren ? (
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={KioskColors.navy}
                  style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }], marginRight: 6 }}
                />
              ) : (
                <View style={styles.chevronSpacer} />
              )}
              <View style={styles.nodeBody}>
                <Text style={styles.nodeName}>{node.name}</Text>
              </View>
            </Pressable>
            {hasChildren && isOpen ? (
              <TreeRows
                nodes={node.children}
                depth={depth + 1}
                ancestorNames={[...ancestorNames, node.name]}
                expanded={expanded}
                toggle={toggle}
                selectedId={selectedId}
                onSelectLeaf={onSelectLeaf}
              />
            ) : null}
          </View>
        );
      })}
    </>
  );
}

/** Step 4 — get-services-by-branch (tree: expand parent, tap leaf to select service_id) */
export function StepService() {
  const { width } = useWindowDimensions();
  const narrow = width < 400;
  const {
    branch,
    serviceName,
    serviceItemId,
    setServiceCategory,
    setServiceName,
    setServiceItemId,
    setSelectedServiceWaitMinutes,
    goNext,
    goBack,
  } = useKiosk();

  const [expanded, setExpanded] = useState(() => new Set<string>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roots, setRoots] = useState<ServiceTreeNode[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!branch) {
      setRoots([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      setExpanded(new Set());
      setServiceCategory(null);
      setServiceName(null);
      setServiceItemId(null);
      setSelectedServiceWaitMinutes(null);
      try {
        const tree = await apiGetServicesByBranch(branch);
        if (!cancelled) setRoots(tree);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load services');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    branch,
    setServiceCategory,
    setServiceName,
    setServiceItemId,
    setSelectedServiceWaitMinutes,
  ]);

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onSelectLeaf = useCallback(
    (node: ServiceTreeNode, pathLabel: string) => {
      setServiceCategory(pathLabel);
      setServiceName(node.name);
      setServiceItemId(node.id);
      setSelectedServiceWaitMinutes(
        typeof node.estimated_wait_minutes === 'number' ? node.estimated_wait_minutes : null,
      );
    },
    [setServiceCategory, setServiceName, setServiceItemId, setSelectedServiceWaitMinutes],
  );

  const canContinue = Boolean(serviceItemId && serviceName);

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>Select Service</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={KioskColors.navy} />
        </View>
      ) : (
        <>
          <FieldError message={error} />
          <View style={styles.treeWrap}>
            {roots.length === 0 ? (
              <Text style={styles.empty}>No services for this branch.</Text>
            ) : (
              <TreeRows
                nodes={roots}
                depth={0}
                ancestorNames={[]}
                expanded={expanded}
                toggle={toggle}
                selectedId={serviceItemId}
                onSelectLeaf={onSelectLeaf}
              />
            )}
          </View>
        </>
      )}

      <View style={[styles.footer, narrow && styles.footerStack]}>
        <GrayButton
          title="Back"
          showBackArrow
          onPress={goBack}
          flex={narrow ? undefined : 1}
          style={narrow ? styles.btnFull : undefined}
        />
        <GradientButton
          title="Continue"
          disabled={!canContinue || loading}
          onPress={goNext}
          flex={narrow ? undefined : 1.4}
          style={narrow ? styles.btnFull : undefined}
        />
      </View>
    </KioskCard>
  );
}

const styles = StyleSheet.create({
  cardTight: {
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: KioskColors.navy,
    marginBottom: 20,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
  center: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  treeWrap: {
    borderWidth: 1,
    borderColor: KioskColors.greyLine,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: KioskColors.white,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: KioskColors.greyLine,
    backgroundColor: KioskColors.white,
  },
  nodeRowSelected: {
    backgroundColor: KioskColors.lightBlueSelect,
  },
  chevronSpacer: {
    width: 26,
    marginRight: 6,
  },
  nodeBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nodeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: KioskColors.navy,
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    color: KioskColors.greyMuted,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerStack: {
    flexDirection: 'column',
  },
  btnFull: {
    width: '100%',
  },
});
