import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export const HomeIcon = (props) => (
<MaterialCommunityIcons name="file-download-outline" size={28} {...props} />)

export const BattleIcon = (props) => (
    <FontAwesome6 name="hand-back-fist" size={28} {...props} />
)

export const SearchIcon = (props) => (
    <MaterialCommunityIcons name="account-search" size={28} {...props} />
)