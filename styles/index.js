import { StyleSheet } from 'react-native';
import primary_button from './01_atom/button';
import { flexFull } from './utilities';
import LogoContainer from './02_molecule';

export const atoms = StyleSheet.create({
  primary_button,
});

export const molecul = StyleSheet.create({
  LogoContainer,
});

export const utilities = StyleSheet.create({
  flexFull,
});

export default atoms;
