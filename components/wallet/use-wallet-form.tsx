import { database } from '@/model';
import Wallet, { WalletType } from '@/model/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { WalletFormValues, walletSchema } from './schema';

export const useWalletForm = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const router = useRouter();
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<WalletFormValues>({
        resolver: zodResolver(walletSchema),
        defaultValues: {
            name: '',
            type: WalletType.SAVINGS,
            balance: '0',
            walletId: ''
        },
    });

    const name = watch('name');
    const type = watch('type');
    const balance = watch('balance');
    const walletId = watch('walletId');

    const handleNumberPress = (num: string) => {
        let current = balance;
        if (current === '0' && num !== '.') {
            current = num;
        } else if (num === '.' && current.includes('.')) {
            // ignore
        } else {
            current += num;
        }
        setValue('balance', current, { shouldValidate: true });
    };

    const handleDeletePress = () => {
        let current = balance;
        if (current.length <= 1) {
            current = '0';
        } else {
            current = current.slice(0, -1);
        }
        setValue('balance', current, { shouldValidate: true });
    };

    const onSubmit = async (values: WalletFormValues) => {
        try {
            await database.write(async () => {
                await database.collections.get<Wallet>('wallets').create((w) => {
                    w.name = values.name;
                    w.type = values.type;
                    w.balance = parseFloat(values.balance);
                    w.walletId = values.walletId;
                });
            });

            if (onSuccess) {
                onSuccess();
            } else {
                router.back();
            }
        } catch (error) {
            console.error('Failed to save wallet:', error);
        }
    };

    return {
        state: {
            name,
            type,
            balance,
            walletId,
            isTypeModalOpen,
            errors,
        },
        actions: {
            setShowTypeModal: setIsTypeModalOpen,
            setValue,
            handleNumberPress,
            handleDeletePress,
            onSubmit: handleSubmit(onSubmit),
            handleCancel: () => onSuccess ? onSuccess() : router.back(),
        },
        control,
    };
};
