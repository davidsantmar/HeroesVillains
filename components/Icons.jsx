import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export const HomeIcon = (props) => (
    <FontAwesome name="superpowers" size={28}  {...props} />
)

export const BattleIcon = (props) => (
    <FontAwesome6 name="hand-back-fist" size={28} {...props} />
)

export const SearchIcon = (props) => (
    <MaterialCommunityIcons name="account-search" size={28} {...props} />
)