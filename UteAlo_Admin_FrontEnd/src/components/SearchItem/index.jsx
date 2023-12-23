import React, { useEffect, useState, useRef } from 'react';

import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { request } from '@/request';
import { useCrudContext } from '@/context/crud';
import { selectSearchedItems } from '@/redux/crud/selectors';
import { useHistory } from 'react-router-dom';
import { Empty } from 'antd';

export default function SearchItem({ config }) {
	const history = useHistory();
	let { entity, searchConfig } = config;

	const { displayLabels, searchFields, outputValue = 'userId' } = searchConfig;
	const dispatch = useDispatch();
	const [value, setValue] = useState('');
	const [options, setOptions] = useState([]);

	const { crudContextAction } = useCrudContext();
	const { panel, collapsedBox, readBox } = crudContextAction;

	let source = request.source();
	const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);

	const isTyping = useRef(false);

	let delayTimer = null;
	useEffect(() => {
		isLoading && setOptions([{ label: '... Đang tìm kiếm' }]);
	}, [isLoading]);
	const onSearch = (searchText) => {
		isTyping.current = true;

		clearTimeout(delayTimer);
		delayTimer = setTimeout(function () {
			if (isTyping.current && searchText !== '') {
				dispatch(
					crud.search(entity, source, {
						question: searchText,
						fields: searchFields,
					})
				);
			}
			isTyping.current = false;
		}, 500);
	};

	const onSelect = (data) => {
		history.push(`/userStatistics/${data}`);
	};

	const onChange = (data) => {
		const currentItem = options.find((item) => {
			return item.value === data;
		});
		const currentValue = currentItem ? currentItem.label : data;
		setValue(currentValue);
	};

	const handleOptionClick = (item) => {
		console.log('item', item);
	};
	useEffect(() => {
		let optionResults = [];

		result.map((item) => {
			const labels = displayLabels.map((x) => item[x]).join(' ');
			optionResults.push({
				label: labels,
				value: item[outputValue],
				onClick: () => handleOptionClick(item),
			});
		});

		setOptions(optionResults);
	}, [result]);

	return (
		<AutoComplete
			value={value}
			options={options}
			style={{
				width: '100%',
			}}
			onSelect={onSelect}
			onSearch={onSearch}
			onChange={onChange}
			notFoundContent={!isSuccess ? <Empty /> : ''}
			allowClear={true}
			placeholder="Tìm kiếm ...."
		>
			<Input suffix={<SearchOutlined />} />
		</AutoComplete>
	);
}
