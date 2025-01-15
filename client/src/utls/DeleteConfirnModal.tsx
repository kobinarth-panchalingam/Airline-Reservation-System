import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

interface OpenDeleteConfirmModalProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel?: () => void;
}

export function openDeleteConfirmModal({
	title,
	message,
	onConfirm,
	onCancel,
}: OpenDeleteConfirmModalProps) {
	modals.openConfirmModal({
		title,
		centered: true,
		children: <Text size="sm">{message}</Text>,
		labels: { confirm: "Delete", cancel: "Cancel" },
		confirmProps: { color: "red" },
		onCancel:
			onCancel ||
			(() => {
				console.log("Cancel");
			}),
		onConfirm,
	});
}
