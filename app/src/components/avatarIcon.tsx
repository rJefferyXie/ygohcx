interface Icon {
  [key: string]: string,
  name: string,
  icon: string
}

interface AvatarIconProps {
  icon: Icon,
  isSelected: boolean,
  selectIcon: Function
}

const AvatarIcon = (props: React.PropsWithChildren<AvatarIconProps>) => {
  const { icon, isSelected, selectIcon } = props;

  return (
    <div className="" onClick={() => selectIcon(icon.name)}>
      <img 
        src={icon.icon}
        alt="Yugioh Icon Image."
        className="brightness-50 rounded-full"
        style={isSelected ? {backgroundColor: 'rgba(12, 74, 110, 0.5)', filter: 'brightness(125%)'} : {}}
        width={108}
        height={108}
      />
    </div>
  )
}

export default AvatarIcon;