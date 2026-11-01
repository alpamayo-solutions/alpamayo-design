import { ALP_ICON_IDS, type AlpIconId } from './alpIconIds';

/**
 * The string form of an icon, for fields such as `item.icon` that hold a string and that
 * PREKIT's server validates as /^[a-z0-9_]{1,64}$/: `alp_` + the id with `-` replaced by `_`.
 */
export type AlpIconName = `alp_${string}`;

const IDS_BY_NAME = new Map<string, AlpIconId>(
    ALP_ICON_IDS.map((id) => [`alp_${id.replaceAll('-', '_')}`, id])
);

/** True when `value` is the string form of an icon in the set, e.g. `alp_opc_ua`. */
export function isAlpIcon(value: unknown): value is AlpIconName {
    return typeof value === 'string' && IDS_BY_NAME.has(value);
}

/** The icon id for a string form (`alp_opc_ua` gives `opc-ua`), undefined for anything else. */
export function alpIconId(value: unknown): AlpIconId | undefined {
    return typeof value === 'string' ? IDS_BY_NAME.get(value) : undefined;
}
